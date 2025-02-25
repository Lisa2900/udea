import { Router } from 'express';
import { registerUser } from '../controllers/authController';
import { verifyCode } from '../controllers/verifyController';
import { loginUser } from '../controllers/loginController';
import { forgotPassword, resetPassword} from '../controllers/passwordController'
import { inicio } from '../controllers/presentation';
// Rutas para el registro, verificación de código, inicio de sesión y recuperación de contraseña
const router = Router();
router.post('/', inicio);
router.post('/register', registerUser);
router.post('/verify-code', verifyCode);
router.post('/login', loginUser);
// Ruta para solicitar recuperación de contraseña
router.post('/forgot-password', forgotPassword);
// Ruta para restablecer la contraseña usando el token
router.post('/reset-password', resetPassword);

export default router;
