import express from "express"
import cors from "cors"
import appartmentRouter from "./route/appartment.mjs"
import roomRouter from "./route/room.mjs"
import postRouter from "./route/post.mjs"
import fileRouter from "./route/file.mjs"

import { sequelize } from "./model/index.mjs"


import path from "path"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")))
app.use("/mutama/api/uploads", express.static(path.join(process.cwd(), "uploads")))

app.use("/api/appartment", appartmentRouter)
app.use("/api/room", roomRouter)
app.use("/api/post", postRouter)
app.use("/api/file", fileRouter)

app.get("/api/", (req, res) => {
  res.send("Mutama API")
})

app.get("/api/health", (req, res) => {
  res.send("OK")
})

/** START SERVER */
const PORT = process.env.PORT
const APP_URL = process.env.APP_URL

app.listen(PORT, () => {
  sequelize.authenticate()
    .then(() => {
      console.log(`Mutama API running on ${APP_URL}`)
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err)
    })
})

export default app