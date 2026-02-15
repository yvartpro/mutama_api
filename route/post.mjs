import express from "express"
const router = express.Router()
import db from "../model/index.mjs"
import { authenticate } from "../middleware/auth.mjs"

const Post = db.Post

import { resolveFiles } from "../service/fileResolver.mjs"

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.File, as: 'contentFiles', through: { attributes: [] } },
        { model: db.File, as: 'heroImage' }
      ]
    })
    const results = await Promise.all(posts.map(async (post) => {
      const data = post.toJSON()
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
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: db.File, as: 'contentFiles', through: { attributes: [] } },
        { model: db.File, as: 'heroImage' }
      ]
    })
    if (!post) return res.status(404).json({ error: "Post not found" })
    const data = post.toJSON()
    data.images = await resolveFiles(data.images)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post("/", authenticate, async (req, res) => {
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

router.patch("/:id", authenticate, async (req, res) => {
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

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })
    await post.destroy()
    res.json({ message: "Post deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
