const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const JWT_EXPIRES_IN = "24h";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    next();
  });
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const adminUser = await Admin.findOne({ email });
    if (
      !adminUser ||
      !(await bcrypt.compare(password, adminUser.passwordHash))
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        admin: true,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    valid: true,
  });
});

module.exports = { router, authenticateToken };
