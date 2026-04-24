const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Document } = require("../models");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

/**
 * @swagger
 * tags:
 *   name: Document
 *   description: Document management API
 */

/**
 * @swagger
 * /document:
 *   get:
 *     summary: Retrieve a list of documents
 *     tags: [Document]
 *     responses:
 *       200:
 *         description: A list of documents.
 */
router.get("/", async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /document/{id}:
 *   get:
 *     summary: Get a document by ID
 *     tags: [Document]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A document object.
 *       404:
 *         description: Document not found.
 */
router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /document:
 *   post:
 *     summary: Create a new document
 *     tags: [Document]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               claim_id:
 *                 type: integer
 *               dossier_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [InsuranceCertificate, RegistrationCertificate, IdentityDocument, Invoice, BankDetails, Other]
 *               file_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created document.
 */
router.post("/", async (req, res) => {
  try {
    const doc = await Document.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /document/upload:
 *   post:
 *     summary: Upload a document file
 *     tags: [Document]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               claim_id:
 *                 type: integer
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: The uploaded document.
 */
router.post("/upload", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const file_url = "/uploads/" + req.file.filename;
    const body = { ...req.body, file_url };
    
    const doc = await Document.create(body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /document/{id}:
 *   put:
 *     summary: Update a document
 *     tags: [Document]
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
 *               type:
 *                 type: string
 *               file_url:
 *                 type: string
 *               validated_by_manager:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The updated document.
 *       404:
 *         description: Document not found.
 */
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Document.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Document not found" });
    const updatedDoc = await Document.findByPk(req.params.id);
    res.json(updatedDoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /document/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Document]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Document deleted successfully.
 *       404:
 *         description: Document not found.
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Document.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "Document not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
