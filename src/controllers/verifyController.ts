import { Request, Response } from 'express';
import { 
  saveVerificationCode, 
  verifyUserByCode, 
  updateUserVerified 
} from '../models/userModel';

// Generar un código de verificación
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verificar el código de verificación
export const verifyCode = async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400).json({ message: 'Correo y código son requeridos' });
    return;
  }

  try {
    const { isCodeValid, isCodeExpired } = await verifyUserByCode(email, code);

    if (isCodeExpired) {
      const newCode = generateVerificationCode();
      const newExpiryTime = new Date();
      newExpiryTime.setMinutes(newExpiryTime.getMinutes() + 30);

      await saveVerificationCode(email, newCode);  // Se envía un nuevo código por correo aquí
      res.status(400).json({ message: 'Código expirado. Se ha enviado uno nuevo a su correo.' });
    } else if (!isCodeValid) {
      res.status(400).json({ message: 'Código inválido.' });
    } else {
      await updateUserVerified(email);
      res.status(200).json({ message: 'Código verificado correctamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar el código', error: (error as Error).message });
  }
};
