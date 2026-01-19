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
import { docsHtml } from "./service/docs.mjs"



/** SERVER  CONFIG */
const PORT = process.env.PORT
const APP_URL = process.env.APP_URL


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

app.get("/mutama/api/", (req, res) => {
  const endpoints = {
    appartment: [
      { method: "GET", path: "api/appartment", description: "Get all appartments" },
      { method: "POST", path: "api/appartment", description: "Create a new appartment" },
      { method: "GET", path: "api/appartment/:id", description: "Get a appartment by id" },
      { method: "PATCH", path: "api/appartment/:id", description: "Update a appartment by id" },
      { method: "DELETE", path: "api/appartment/:id", description: "Delete a appartment by id" }
    ],
    room: [
      { method: "GET", path: "api/room", description: "Get all rooms" },
      { method: "POST", path: "api/room", description: "Create a new room" },
      { method: "GET", path: "api/room/:id", description: "Get a room by id" },
      { method: "PATCH", path: "api/room/:id", description: "Update a room by id" },
      { method: "DELETE", path: "api/room/:id", description: "Delete a room by id" }
    ],
    post: [
      { method: "GET", path: "api/post", description: "Get all posts" },
      { method: "POST", path: "api/post", description: "Create a new post" },
      { method: "GET", path: "api/post/:id", description: "Get a post by id" },
      { method: "PATCH", path: "api/post/:id", description: "Update a post by id" },
      { method: "DELETE", path: "api/post/:id", description: "Delete a post by id" }
    ],
    file: [
      { method: "GET", path: "api/file", description: "Get all files" },
      { method: "POST", path: "api/file", description: "Create a new file" },
      { method: "GET", path: "api/file/:id", description: "Get a file by id" },
      { method: "PATCH", path: "api/file/:id", description: "Update a file by id" },
      { method: "DELETE", path: "api/file/:id", description: "Delete a file by id" }
    ]
  };

  const htmlContent = docsHtml(endpoints, APP_URL)
  res.send(htmlContent);
})


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