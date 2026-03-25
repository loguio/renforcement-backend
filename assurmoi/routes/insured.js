const express = require("express");
const router = express.Router();
const { Insured } = require("../models");

/**
 * @swagger
 * tags:
 *   name: Insured
 *   description: Insured management API
 */

/**
 * @swagger
 * /insured:
 *   get:
 *     summary: Retrieve a list of insureds
 *     tags: [Insured]
 *     responses:
 *       200:
 *         description: A list of insureds.
 */
router.get("/", async (req, res) => {
  try {
    const insureds = await Insured.findAll();
    res.json(insureds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /insured/{id}:
 *   get:
 *     summary: Get an insured by ID
 *     tags: [Insured]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An insured object.
 *       404:
 *         description: Insured not found.
 */
router.get("/:id", async (req, res) => {
  try {
    const insured = await Insured.findByPk(req.params.id);
    if (!insured) return res.status(404).json({ error: "Insured not found" });
    res.json(insured);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /insured:
 *   post:
 *     summary: Create a new insured
 *     tags: [Insured]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created insured.
 */
router.post("/", async (req, res) => {
  try {
    const insured = await Insured.create(req.body);
    res.status(201).json(insured);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /insured/{id}:
 *   put:
 *     summary: Update an insured
 *     tags: [Insured]
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
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated insured.
 *       404:
 *         description: Insured not found.
 */
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Insured.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Insured not found" });
    const updatedInsured = await Insured.findByPk(req.params.id);
    res.json(updatedInsured);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /insured/{id}:
 *   delete:
 *     summary: Delete an insured
 *     tags: [Insured]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Insured deleted successfully.
 *       404:
 *         description: Insured not found.
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Insured.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Insured not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
