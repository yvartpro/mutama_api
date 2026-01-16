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

router.post("/", async (req, res) => {
  const t = await db.sequelize.transaction()
  try {
    const { contentFiles, ...postData } = req.body
    const post = await Post.create(postData, { transaction: t })

    if (contentFiles && Array.isArray(contentFiles)) {
      await post.setContentFiles(contentFiles, { transaction: t })
    }

    await t.commit()
    res.json(post)
  } catch (err) {
    await t.rollback()
    res.status(500).json({ error: err.message })
  }
})

router.patch("/:id", async (req, res) => {
  const t = await db.sequelize.transaction()
  try {
    const post = await Post.findByPk(req.params.id, { transaction: t })
    if (!post) {
      await t.rollback()
      return res.status(404).json({ error: "Post not found" })
    }

    const { contentFiles, ...postData } = req.body
    await post.update(postData, { transaction: t })

    if (contentFiles && Array.isArray(contentFiles)) {
      await post.setContentFiles(contentFiles, { transaction: t })
    }

    await t.commit()
    res.json(post)
  } catch (err) {
    await t.rollback()
    res.status(500).json({ error: err.message })
  }
})

router.delete("/:id", (req, res) => {
  Post.findByPk(req.params.id)
    .then(post => {
      if (!post) return res.status(404).json({ error: "Post not found" })
      post.destroy()
        .then(post => res.json(post))
        .catch(err => res.status(500).json({ error: err.message }))
    })
    .catch(err => res.status(500).json({ error: err.message }))
})

export default router
