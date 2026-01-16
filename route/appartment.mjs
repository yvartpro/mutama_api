import express from "express"
const router = express.Router()
import db from "../model/index.mjs"

const Appartment = db.Appartment

import { resolveFiles } from "../service/fileResolver.mjs"

router.get("/", async (req, res) => {
  try {
    const appartments = await Appartment.findAll({ order: [['createdAt', 'DESC']] })
    const results = await Promise.all(appartments.map(async (app) => {
      const data = app.toJSON()
      data.images = await resolveFiles(data.images)
      return data
    }))
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const appartment = await Appartment.findByPk(req.params.id)
    if (!appartment) return res.status(404).json({ error: "Appartment not found" })
    const data = appartment.toJSON()
    data.images = await resolveFiles(data.images)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post("/", (req, res) => {
  Appartment.create(req.body)
    .then(appartment => res.json(appartment))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.patch("/:id", (req, res) => {
  Appartment.findByPk(req.params.id)
    .then(appartment => {
      appartment.update(req.body)
        .then(appartment => res.json(appartment))
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
})

router.delete("/:id", (req, res) => {
  Appartment.findByPk(req.params.id)
    .then(appartment => {
      appartment.destroy()
        .then(appartment => res.json(appartment))
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
})

export default router
