import express from "express"
const router = express.Router()
import db from "../model/index.mjs"

const Post = db.Post

router.get("/", (req, res) => {
  Post.findAll({ order: [['createdAt', 'DESC']] })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.get("/:id", (req, res) => {
  Post.findByPk(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.post("/", (req, res) => {
  Post.create(req.body)
    .then(post => res.json(post))
    .catch(err => res.status(500).json({ error: err.message }))
})

router.put("/:id", (req, res) => {
  Post.findByPk(req.params.id)
    .then(post => {
      post.update(req.body)
        .then(post => res.json(post))
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
})

router.delete("/:id", (req, res) => {
  Post.findByPk(req.params.id)
    .then(post => {
      post.destroy()
        .then(post => res.json(post))
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
})

export default router
