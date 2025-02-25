import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Bienvenido al panel de administración." });
});

router.post("/create-user", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Usuario creado con éxito (solo admin)." });
});

export default router;
