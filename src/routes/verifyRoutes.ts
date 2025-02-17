import { Router } from 'express';
import { verifyEmail, verifyCode } from '../controllers/verifyController';

const router = Router();

// Ruta para verificar el correo electrónico con el token
router.post('/verify-email', verifyEmail);

// Ruta para verificar el código de verificación enviado por correo
router.post('/verify-code', verifyCode);

export default router;
