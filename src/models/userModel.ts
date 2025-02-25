import db from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Definir interfaz para el usuario
interface User {
  role: string;
  id?: number;
  name: string;
  email: string;
  password: string;
  verified?: boolean;
  verification_code?: string;
  verification_code_expiry?: Date;
}

// **Crear un nuevo usuario**
export const createUser = (name: string, email: string, password: string): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users (name, email, password, verified) VALUES (?, ?, ?, ?)`;
    db.query(query, [name, email, password, false], (err, result) => {
      if (err) {
        console.error('Error al crear usuario:', err);
        return reject(new Error('Error al registrar el usuario.'));
      }
      resolve(result as ResultSetHeader);
    });
  });
};

// **Guardar código de verificación en la tabla users**
export const saveVerificationCode = (email: string, code: string): Promise<ResultSetHeader> => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 30); // Expira en 30 minutos

  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET verification_code = ?, verification_code_expiry = ? WHERE email = ?`;
    db.query(query, [code, expiryTime, email], (err, result) => {
      if (err) {
        console.error('Error al guardar código de verificación:', err);
        return reject(new Error('Error al guardar código de verificación.'));
      }
      resolve(result as ResultSetHeader);
    });
  });
};

// **Buscar usuario por correo electrónico**
export const findUserByEmail = (email: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error al buscar usuario por email:', err);
        return reject(new Error('Error al buscar usuario.'));
      }

      const rows = results as RowDataPacket[];
      resolve(rows.length > 0 ? (rows[0] as User) : null);
    });
  });
};

// **Verificar código de verificación**
export const verifyUserByCode = (email: string, code: string): Promise<{ isCodeValid: boolean, isCodeExpired: boolean }> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT verification_code, verification_code_expiry FROM users WHERE email = ?`;

    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error al verificar código de verificación:', err);
        return reject(new Error('Error al verificar el código.'));
      }

      const rows = results as RowDataPacket[];
      if (rows.length === 0) {
        return reject(new Error('Código de verificación no encontrado.'));
      }

      const user = rows[0] as User;
      const isCodeValid = user.verification_code === code;
      const now = new Date();
      const expiryDate = new Date(user.verification_code_expiry!);

      if (isNaN(expiryDate.getTime())) {
        console.error('Error: La fecha de expiración no es válida.');
        return reject(new Error('Fecha de expiración inválida.'));
      }

      const isCodeExpired = now.getTime() > expiryDate.getTime();

      resolve({ isCodeValid, isCodeExpired });
    });
  });
};

// **Actualizar usuario como verificado**
export const updateUserVerified = (email: string): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET verified = TRUE WHERE email = ?`;
    db.query(query, [email], (err, result) => {
      if (err) {
        console.error('Error al actualizar usuario verificado:', err);
        return reject(new Error('Error al actualizar el estado de verificación.'));
      }
      resolve(result as ResultSetHeader);
    });
  });
};

// **Eliminar usuario por email**
export const deleteUserByEmail = (email: string): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM users WHERE email = ?`;
    db.query(query, [email], (err, result) => {
      if (err) {
        console.error('Error al eliminar usuario:', err);
        return reject(new Error('Error al eliminar usuario.'));
      }
      resolve(result as ResultSetHeader);
    });
  });
};
