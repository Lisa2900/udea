import { Request, Response } from 'express';
import { findUserByEmail, savePasswordResetCode, verifyResetCode, updateUserPassword } from '../models/passwordModel';
import { sendResetPasswordEmail } from '../utils/emailUtils'; // Función para enviar correos
import bcrypt from 'bcryptjs';

// Función para generar un código de 6 dígitos
const generateResetCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Solicitar recuperación de contraseña
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Correo electrónico es requerido' });
    return;
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(400).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Generar un código de verificación de 6 dígitos
    const code = generateResetCode();

    // Guardar el código en la base de datos (con fecha de expiración)
    await savePasswordResetCode(email, code);

    // Enviar el código al correo electrónico
    await sendResetPasswordEmail(email, code);

    res.status(200).json({ message: 'Se ha enviado un correo para restablecer la contraseña' });
  } catch (error) {
    res.status(500).json({ message: 'Error al solicitar recuperación de contraseña', error: (error as Error).message });
  }
};



// Restablecer la contraseña con el código de 6 dígitos
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { code, newPassword } = req.body;

  if (!code || !newPassword) {
    res.status(400).json({ message: 'Código y nueva contraseña son requeridos' });
    return;
  }

  try {
    // Verificar el código
    const userEmail = await verifyResetCode(code);

    if (!userEmail) {
      res.status(400).json({ message: 'Código inválido o expirado' });
      return;
    }

    // Encriptar la nueva contraseña antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);  // Usamos bcryptjs aquí

    // Actualizar la contraseña
    await updateUserPassword(userEmail, hashedPassword);

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña', error: (error as Error).message });
  }
};
