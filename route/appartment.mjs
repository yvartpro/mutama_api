import express from "express"
const router = express.Router()
import db, { sequelize } from "../model/index.mjs"

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

router.post("/", async (req, res) => {
  const t = await sequelize.transaction()
  try {
    // We store IDs in the database, so we keep req.body.images as is (assuming it's IDs)
    const appartment = await Appartment.create(req.body, { transaction: t })
    await t.commit()

    // Resolve for response
    const data = appartment.toJSON()
    data.images = await resolveFiles(data.images)
    res.json(data)
  } catch (err) {
    await t.rollback()
    res.status(500).json({ error: err.message })
  }
})

router.patch("/:id", async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const appartment = await Appartment.findByPk(req.params.id)
    if (!appartment) {
      await t.rollback()
      return res.status(404).json({ error: "Appartment not found" })
    }

    await appartment.update(req.body, { transaction: t })
    await t.commit()

    // Resolve for response
    const data = appartment.toJSON()
    data.images = await resolveFiles(data.images)
    res.json(data)
  } catch (err) {
    if (t) await t.rollback()
    res.status(500).json({ error: err.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const appartment = await Appartment.findByPk(req.params.id)
    if (!appartment) return res.status(404).json({ error: "Appartment not found" })
    await appartment.destroy()
    res.json({ message: "Appartment deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
