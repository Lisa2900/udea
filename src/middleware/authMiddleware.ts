import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interfaz para extender Request y almacenar el usuario
interface AuthRequest extends Request {
  user?: any;
}

// Middleware para verificar el token y extraer el usuario
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    return;  // No olvides retornar aquí, para evitar que se siga ejecutando el middleware
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();  // Continúa al siguiente middleware o ruta
  } catch (error) {
    res.status(400).json({ message: "Token inválido." });
    return;  // Importante retornar para evitar que se continúe el flujo si el token es inválido
  }
};

// Middleware para verificar si el usuario es Admin
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Acceso denegado. Solo administradores pueden acceder." });
    return;  // Evitar que se continúe si el usuario no es admin
  }
  next();  // Continúa al siguiente middleware o ruta
};

// Middleware para verificar si el usuario es Estudiante
export const isStudent = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "student") {
    res.status(403).json({ message: "Acceso denegado. Solo estudiantes pueden acceder." });
    return;  // Evitar que se continúe si el usuario no es estudiante
  }
  next();  // Continúa al siguiente middleware o ruta
};
