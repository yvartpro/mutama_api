import express from "express"
const router = express.Router()
import db, { sequelize } from "../model/index.mjs"

const Room = db.Room

import { resolveFiles } from "../service/fileResolver.mjs"

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.findAll({ order: [['createdAt', 'DESC']] })
    const results = await Promise.all(rooms.map(async (room) => {
      const data = room.toJSON()
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
    const room = await Room.findByPk(req.params.id)
    if (!room) return res.status(404).json({ error: "Room not found" })
    const data = room.toJSON()
    data.images = await resolveFiles(data.images)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post("/", async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const room = await Room.create(req.body, { transaction: t })
    await t.commit()

    // Resolve for response
    const data = room.toJSON()
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
    const room = await Room.findByPk(req.params.id)
    if (!room) {
      await t.rollback()
      return res.status(404).json({ error: "Room not found" })
    }

    await room.update(req.body, { transaction: t })
    await t.commit()

    // Resolve for response
    const data = room.toJSON()
    data.images = await resolveFiles(data.images)
    res.json(data)
  } catch (err) {
    if (t) await t.rollback()
    res.status(500).json({ error: err.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id)
    if (!room) return res.status(404).json({ error: "Room not found" })
    await room.destroy()
    res.json({ message: "Room deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router