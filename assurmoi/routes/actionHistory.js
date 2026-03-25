const express = require("express");
const router = express.Router();
const { ActionHistory } = require("../models");

/**
 * @swagger
 * tags:
 *   name: ActionHistory
 *   description: Action History management API
 */

/**
 * @swagger
 * /action-history:
 *   get:
 *     summary: Retrieve a list of action histories
 *     tags: [ActionHistory]
 *     responses:
 *       200:
 *         description: History logs.
 */
router.get("/", async (req, res) => {
  try {
    const history = await ActionHistory.findAll();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /action-history/{id}:
 *   get:
 *     summary: Get an action history by ID
 *     tags: [ActionHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An action history object.
 *       404:
 *         description: Action history not found.
 */
router.get("/:id", async (req, res) => {
  try {
    const history = await ActionHistory.findByPk(req.params.id);
    if (!history) return res.status(404).json({ error: "Action history not found" });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /action-history:
 *   post:
 *     summary: Record a new action
 *     tags: [ActionHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               claim_id:
 *                 type: integer
 *               dossier_id:
 *                 type: integer
 *               action:
 *                 type: string
 *               details:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created log.
 */
router.post("/", async (req, res) => {
  try {
    const log = await ActionHistory.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /action-history/{id}:
 *   put:
 *     summary: Update an action history
 *     tags: [ActionHistory]
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
 *         description: The updated log.
 *       404:
 *         description: Action history not found.
 */
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await ActionHistory.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Action history not found" });
    const updatedHistory = await ActionHistory.findByPk(req.params.id);
    res.json(updatedHistory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /action-history/{id}:
 *   delete:
 *     summary: Delete an action history
 *     tags: [ActionHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Action history deleted successfully.
 *       404:
 *         description: Action history not found.
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ActionHistory.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Action history not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
