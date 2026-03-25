const express = require("express");
const router = express.Router();
const { Claim } = require("../models");

/**
 * @swagger
 * tags:
 *   name: Claim
 *   description: Claim management API
 */

/**
 * @swagger
 * /claim:
 *   get:
 *     summary: Retrieve a list of claims
 *     tags: [Claim]
 *     responses:
 *       200:
 *         description: A list of claims.
 */
router.get("/", async (req, res) => {
  try {
    const claims = await Claim.findAll();
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /claim/{id}:
 *   get:
 *     summary: Get a claim by ID
 *     tags: [Claim]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A claim object.
 *       404:
 *         description: Claim not found.
 */
router.get("/:id", async (req, res) => {
  try {
    const claim = await Claim.findByPk(req.params.id);
    if (!claim) return res.status(404).json({ error: "Claim not found" });
    res.json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /claim:
 *   post:
 *     summary: Create a new claim
 *     tags: [Claim]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference:
 *                 type: string
 *               insured_id:
 *                 type: integer
 *               vehicle_registration:
 *                 type: string
 *               driver_last_name:
 *                 type: string
 *               driver_first_name:
 *                 type: string
 *               driver_is_insured:
 *                 type: boolean
 *               call_datetime:
 *                 type: string
 *                 format: date-time
 *               claim_datetime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: The created claim.
 */
router.post("/", async (req, res) => {
  try {
    const claim = await Claim.create(req.body);
    res.status(201).json(claim);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /claim/{id}:
 *   put:
 *     summary: Update a claim
 *     tags: [Claim]
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
 *         description: The updated claim.
 *       404:
 *         description: Claim not found.
 */
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Claim.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Claim not found" });
    const updatedClaim = await Claim.findByPk(req.params.id);
    res.json(updatedClaim);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /claim/{id}:
 *   delete:
 *     summary: Delete a claim
 *     tags: [Claim]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Claim deleted successfully.
 *       404:
 *         description: Claim not found.
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Claim.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Claim not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
