import express from "express"
const router = express.Router()
import db from "../model/index.mjs"

const Room = db.Room

router.get("/", (req, res) => {
  Room.findAll({ order: [['createdAt', 'DESC']] })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.get("/:id", (req, res) => {
  Room.findByPk(req.params.id)
    .then(room => res.json(room))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.post("/", (req, res) => {
  Room.create(req.body)
    .then(room => res.json(room))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.put("/:id", (req, res) => {
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