const router = express.Router();
const { Dossier, Claim } = require("../models");
const { requireRoles } = require("../middlewares/auth");

const computeDossierStep = async (dossier) => {
  if (!dossier.date_expertise_planifiee) return "Dossier initialisé / Demande d'expertise en attente";
  if (!dossier.date_expertise_effective) return "Expertise planifiée";
  if (!dossier.date_retour_expertise) return "Expertise réalisée, attente de retour d'expert";
  
  if (dossier.scenario === "RepairableVehicle") {
    if (!dossier.date_intervention_planifiee) return "Véhicule réparable, intervention à planifier";
    if (!dossier.date_prise_en_charge_planifiee) return "Intervention planifiée, prise en charge en attente";
    if (!dossier.date_prise_en_charge_effective) return "Prise en charge du véhicule planifiée";
    if (!dossier.date_debut_intervention) return "Prise en charge réalisée";
    if (!dossier.date_fin_intervention) return "Intervention en cours sur le véhicule";
    if (!dossier.date_restitution_planifiee) return "Livraison du véhicule, restitution à planifier";
    if (!dossier.date_restitution_effective) return "Véhicule en cours de restitution";
    if (!dossier.date_reception_facture) return "Véhicule restitué, en attente de facturation";
    if (!dossier.date_reglement) return "Facture reçue, en attente de règlement";
    
    // Check responsability factor
    const claim = await Claim.findByPk(dossier.claim_id);
    if (!claim) return `Règlement réalisé. (Erreur Sinistre introuvable)`;
    if (claim.responsibility_percentage === 100) return "Dossier clos (100% responsable)";
    if (!dossier.facture_reglee_assurance_tiers) return "Règlement réalisé, en attente refacturation assurance tiers";
    
    return "Dossier clos";
  }
  
  if (dossier.scenario === "WreckedVehicle") {
    if (!dossier.montant_estimation_indemnisation) return "Véhicule épave, estimation indemnisation à faire";
    if (dossier.approbation_client === null) return "Estimation communiquée, en attente d'approbation";
    if (!dossier.date_previsionnelle_prise_en_charge) return "Estimation acceptée, prise en charge en attente (RIB nécessaire)";
    if (!dossier.date_prise_en_charge_effective) return "Prise en charge du véhicule planifiée";
    if (!dossier.date_indemnisation) return "Prise en charge réalisée, indemnisation en attente de règlement";
    
    // Check responsability factor
    const claim = await Claim.findByPk(dossier.claim_id);
    if (!claim) return `Règlement réalisé. (Erreur Sinistre introuvable)`;
    if (claim.responsibility_percentage === 100) return "Dossier clos (100% responsable)";
    if (!dossier.facture_reglee_assurance_tiers) return "Règlement réalisé, en attente refacturation assurance tiers";
    
    return "Dossier clos";
  }
  
  return "Scénario non défini - En attente diagnostic";
};

/**
 * @swagger
 * tags:
 *   name: Dossier
 *   description: Dossier management API
 */

/**
 * @swagger
 * /dossier:
 *   get:
 *     summary: Retrieve a list of dossiers
 *     tags: [Dossier]
 *     responses:
 *       200:
 *         description: A list of dossiers.
 */
router.get("/", async (req, res) => {
  try {
    const dossiers = await Dossier.findAll();
    const enrichedDossiers = await Promise.all(
      dossiers.map(async (d) => {
        const json = d.toJSON();
        json.computed_step = await computeDossierStep(d);
        return json;
      })
    );
    res.json(enrichedDossiers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /dossier/{id}:
 *   get:
 *     summary: Get a dossier by ID
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A dossier object.
 *       404:
 *         description: Dossier not found.
 */
router.get("/:id", async (req, res) => {
  try {
    const dossier = await Dossier.findByPk(req.params.id);
    if (!dossier) return res.status(404).json({ error: "Dossier not found" });
    
    const json = dossier.toJSON();
    json.computed_step = await computeDossierStep(dossier);
    
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /dossier:
 *   post:
 *     summary: Create a new dossier
 *     tags: [Dossier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dossier_number:
 *                 type: string
 *               claim_id:
 *                 type: integer
 *               tracking_officer_id:
 *                 type: integer
 *               scenario:
 *                 type: string
 *                 enum: [NotDefined, RepairableVehicle, WreckedVehicle]
 *     responses:
 *       201:
 *         description: The created dossier.
 */
router.post("/", requireRoles(["Gestionnaire_Portefeuille"]), async (req, res) => {
  try {
    const dossier = await Dossier.create(req.body);
    res.status(201).json(dossier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /dossier/{id}:
 *   put:
 *     summary: Update a dossier
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The updated dossier.
 *       404:
 *         description: Dossier not found.
 */
router.put("/:id", requireRoles(["Gestionnaire_Portefeuille", "Charge_Suivi", "Administrateur"]), async (req, res) => {
  try {
    const [updated] = await Dossier.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Dossier not found" });
    const updatedDossier = await Dossier.findByPk(req.params.id);
    res.json(updatedDossier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /dossier/{id}:
 *   delete:
 *     summary: Delete a dossier
 *     tags: [Dossier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Dossier deleted successfully.
 *       404:
 *         description: Dossier not found.
 */
router.delete("/:id", requireRoles(["Administrateur"]), async (req, res) => {
  try {
    const deleted = await Dossier.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Dossier not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
