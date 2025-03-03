import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createUser, findUserByEmail, deleteUserByEmail, saveVerificationCode } from '../models/userModel';

dotenv.config(); // Cargar variables de entorno

// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lsoft12oo0@gmail.com",  
    pass: "ebouztbxezugzpuu", 
  },
});

export const registerUser = async (req: Request, res: Response): Promise<void> => { 
  try {
    const { matricula, name, telefono, email, password, carrera } = req.body;

    // Validaciones básicas
    if (!matricula || !name || !telefono || !email || !password || !carrera) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }

    if (!/^\d{10}$/.test(telefono)) {
      res.status(400).json({ message: 'El número telefónico debe tener 10 dígitos' });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'El usuario ya existe' });
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generar un código de verificación de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar el usuario en la base de datos
    await createUser(matricula, name, telefono, email, hashedPassword, carrera);
    
    // Guardar el código en la base de datos asociado al usuario
    await saveVerificationCode(email, verificationCode);

    // Configurar el correo
    const mailOptions = {
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Código de verificación',
      text: `Tu código de verificación es: ${verificationCode}`,
      html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>`,
    };

    // Enviar el correo con el código
    transporter.sendMail(mailOptions, async (error: Error | null) => {
      if (error) {
        await deleteUserByEmail(email); // Eliminar usuario si falla el correo
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ message: 'Error al enviar el correo de verificación' });
        return;
      }
      res.status(200).json({ message: 'Usuario registrado. Revisa tu correo para verificar la cuenta.' });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error });
  }
};
