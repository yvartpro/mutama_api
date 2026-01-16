import express from "express"
import path from "path"
import fs from "fs"
import multer from "multer"
import sharp from "sharp"
import db from "../model/index.mjs"

const router = express.Router()
const File = db.File

const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/", (req, res) => {

  File.findAll({ order: [['createdAt', 'DESC']] })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.get("/:id", (req, res) => {
  File.findByPk(req.params.id)
    .then(file => res.json(file))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.post("/", upload.single('file'), async (req, res) => {
  try {
    if (req.file) {
      const filename = "mutama" + "_" + Math.round(Math.random() * 1E6) + ".webp";
      const outputPath = path.join(uploadDir, filename);
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}/mutama/api`;

      await sharp(req.file.buffer)
        .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      const fileData = {
        url: `${baseUrl}/uploads/${filename}`,
        type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
        alt: req.body.alt || req.file.originalname,
        optimized: true
      };

      const file = await File.create(fileData);
      return res.json(file);
    } else if (req.body.url) {
      const file = await File.create(req.body);
      return res.json(file);
    } else {
      return res.status(400).json({ error: "No file or URL provided" });
    }
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
})

router.patch("/:id", (req, res) => {
  File.findByPk(req.params.id)
    .then(file => {
      file.update(req.body)
        .then(file => res.json(file))
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
})

router.delete("/:id", (req, res) => {
  File.findByPk(req.params.id)
    .then(file => {
      file.destroy()
        .then(file => res.json(file))
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
})

export default router