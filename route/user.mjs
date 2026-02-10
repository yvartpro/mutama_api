import express from "express";
import bcrypt from "bcrypt";
import { User } from "../model/index.mjs";
import { authenticate, isAdmin, generateToken } from "../middleware/auth.mjs";

const router = express.Router();

/** AUTH ROUTES **/

// Login
router.post("/auth/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ where: { phone, is_active: true } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid phone or password" });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        phone: user.phone,
        is_admin: user.is_admin
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// Get current user profile
router.get("/auth/me", authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      id: user.id,
      full_name: user.full_name,
      phone: user.phone,
      is_admin: user.is_admin
    });
  } catch (err) {
    res.status(500).json({ error: "Fetch profile failed" });
  }
});

/** USER MANAGEMENT (Admin Only) **/

// List all users
router.get("/users", authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Fetch users failed" });
  }
});

// Create new user
router.post("/users", authenticate, isAdmin, async (req, res) => {
  try {
    const { full_name, phone, password, is_admin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      full_name,
      phone,
      password: hashedPassword,
      is_admin
    });
    res.status(201).json({
      id: user.id,
      full_name: user.full_name,
      phone: user.phone,
      is_admin: user.is_admin
    });
  } catch (err) {
    res.status(500).json({ error: "User creation failed", details: err.message });
  }
});

// Update user (including deactivation)
router.patch("/users/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { full_name, is_admin, is_active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ full_name, is_admin, is_active });
    res.json({
      id: user.id,
      full_name: user.full_name,
      phone: user.phone,
      is_admin: user.is_admin,
      is_active: user.is_active
    });
  } catch (err) {
    res.status(500).json({ error: "User update failed" });
  }
});

export default router;
