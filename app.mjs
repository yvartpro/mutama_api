import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

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
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")))
app.use("/mutama/api/uploads", express.static(path.join(process.cwd(), "uploads")))
app.use("/mutama", express.static(path.join(process.cwd(), "public")))

app.use("/mutama/api/appartment", appartmentRouter)
app.use("/mutama/api/room", roomRouter)
app.use("/mutama/api/post", postRouter)
app.use("/mutama/api/file", fileRouter)

app.get("/mutama/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"))
})

/** START SERVER */
const PORT = process.env.PORT
const APP_URL = process.env.APP_URL

app.listen(PORT, () => {
  sequelize.authenticate()
    .then(() => {
      console.log(`[DB] Connected successfully`)
      console.log(`[API] Mutama API running on ${APP_URL || `http://localhost:${PORT}`}`)
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err)
    })
})

export default app