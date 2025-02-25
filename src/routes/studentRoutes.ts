import express from "express";
import { verifyToken, isStudent } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", verifyToken, isStudent, (req, res) => {
  res.json({ message: "Perfil del estudiante." });
});

router.get("/courses", verifyToken, isStudent, (req, res) => {
  res.json({ message: "Lista de cursos del estudiante." });
});

export default router;
