import express from "express"
import cors from "cors"
import appartmentRouter from "./route/appartment.mjs"
import roomRouter from "./route/room.mjs"
import postRouter from "./route/post.mjs"
import fileRouter from "./route/file.mjs"

import { sequelize } from "./model/index.mjs"


const app = express()

app.use(cors())
app.use(express.json())

app.use("/appartment", appartmentRouter)
app.use("/room", roomRouter)
app.use("/post", postRouter)
app.use("/file", fileRouter)

app.get("/", (req, res) => {
  res.send("Mutama API")
})

app.get("/health", (req, res) => {
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