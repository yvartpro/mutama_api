import express from "express"
const router = express.Router()
import db from "../model/index.mjs"

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

router.post("/", (req, res) => {
  Room.create(req.body)
    .then(room => res.json(room))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.patch("/:id", (req, res) => {
  Room.findByPk(req.params.id)
    .then(room => {
      room.update(req.body)
        .then(room => res.json(room))
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
})

router.delete("/:id", (req, res) => {
  Room.findByPk(req.params.id)
    .then(room => {
      room.destroy()
        .then(room => res.json(room))
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
})

export default router