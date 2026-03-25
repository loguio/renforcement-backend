const express = require("express");
const router = express.Router();
const { Dossier } = require("../models");

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
    res.json(dossiers);
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
    res.json(dossier);
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
router.post("/", async (req, res) => {
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
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
