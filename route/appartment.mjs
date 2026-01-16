import express from "express"
const router = express.Router()
import db from "../model/index.mjs"

const Appartment = db.Appartment

router.get("/", (req, res) => {
  Appartment.findAll({ order: [['createdAt', 'DESC']] })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.get("/:id", (req, res) => {
  Appartment.findByPk(req.params.id)
    .then(appartment => res.json(appartment))
    .catch(err => res.status(500).json({ error: err.message }))
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
