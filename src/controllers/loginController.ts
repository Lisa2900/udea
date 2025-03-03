import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../models/userModel';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validar que el correo y la contraseña estén presentes
  if (!email || !password) {
    res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    return;
  }

  try {
    // Buscar usuario en la base de datos
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Verificar si el usuario ha confirmado su correo
    if (!user.verified) {
      res.status(403).json({ message: 'Debes verificar tu correo antes de iniciar sesión' });
      return;
    }

    // Verificar si el usuario tiene un rol asignado
    if (!user.role) {
      res.status(403).json({ message: 'No tienes un rol asignado. Contacta al administrador.' });
      return;
    }

    // Comparar la contraseña ingresada con la almacenada en la BD
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    // Definir rutas según el rol del usuario
    const roleRoutes: Record<string, string> = {
      superadmin: '/superadmin/dashboard',
      admin: '/admin/dashboard',
      estudiante: '/estudiante/perfil'
    };

    const redirectUrl = roleRoutes[user.role];

    if (!redirectUrl) {
      res.status(403).json({ message: 'Tu rol no tiene acceso asignado. Contacta al administrador.' });
      return;
    }

    // **Generar Token JWT**
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      'clave_secreta', // Cambia esto por una variable de entorno
      { expiresIn: '2h' } // El token expira en 2 horas
    );

    // Enviar respuesta con datos de sesión
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      role: user.role,
      redirectUrl
    });

  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: (error as Error).message });
  }
};
