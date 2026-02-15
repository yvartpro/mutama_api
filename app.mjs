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
import userRouter from "./route/user.mjs"

import { sequelize } from "./model/index.mjs"
import { docsHtml } from "./service/docs.mjs"
import { authenticate } from "./middleware/auth.mjs"



/** SERVER  CONFIG */
const PORT = process.env.PORT
const APP_URL = process.env.APP_URL


const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")))

app.get("/api/me", authenticate, (req, res) => res.json(req.user));
app.use("/api", userRouter);

app.use("/api/appartment", appartmentRouter)
app.use("/api/room", roomRouter)
app.use("/api/post", postRouter)
app.use("/api/file", fileRouter)

app.get("/api/", (req, res) => {
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

// Dashboard routes - serve static files and SPA fallback
// Handle both /dashboard and /api/dashboard for production proxy compatibility
const dashboardPaths = ["/dashboard", "/api/dashboard"];

dashboardPaths.forEach(dashPath => {
  app.use(dashPath, express.static(path.join(process.cwd(), "public"), {
    index: false,
    fallthrough: true
  }));

  app.get(`${dashPath}*`, (req, res) => {
    const indexPath = path.join(process.cwd(), "public", "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        // If it's a sub-path and file not found, it might be an asset check or an actual error
        if (err.status === 404 && (req.path.includes("assets") || req.path.includes("vite.svg"))) {
          return res.status(404).send("Asset not found");
        }
        console.error(`Error serving dashboard at ${dashPath}:`, err);
        res.status(404).send("Dashboard not found. Please ensure the dashboard is built and deployed.");
      }
    });
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
  sequelize.authenticate()
    .then(() => {
      console.log(`[DB] Connected successfully`)
      console.log(`[API] Severinhouse API running on ${APP_URL || `http://localhost:${PORT}/api/`}`)
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err)
    })
})

export default app