import db from '../config/db';

// Guardar el código de recuperación en la base de datos
export const savePasswordResetCode = (email: string, code: string): Promise<void> => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 30); // El código expira en 30 minutos

  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET reset_code = ?, reset_code_expiry = ? WHERE email = ?`;
    db.query(query, [code, expiryTime, email], (err) => {
      if (err) {
        console.error('Error al guardar el código de recuperación:', err);
        return reject(new Error('Error al guardar el código de recuperación.'));
      }
      resolve();
    });
  });
};

// Verificar el código de recuperación
export const verifyResetCode = (code: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT email, reset_code_expiry FROM users WHERE reset_code = ?`;
    db.query(query, [code], (err, results: import('mysql2').RowDataPacket[]) => {
      if (err) {
        console.error('Error al verificar el código:', err);
        return reject(new Error('Error al verificar el código.'));
      }

      if ((results as import('mysql2').RowDataPacket[]).length === 0) {
        return resolve(null); // No se encontró el código
      }

      const user = results[0];
      const now = new Date();
      const expiryDate = new Date(user.reset_code_expiry);

      if (now > expiryDate) {
        return resolve(null); // Código expirado
      }

      resolve(user.email); // Retornar el correo del usuario
    });
  });
};

// Actualizar la contraseña del usuario
export const updateUserPassword = (email: string, hashedPassword: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET password = ? WHERE email = ?`;
    db.query(query, [hashedPassword, email], (err) => {
      if (err) {
        console.error('Error al actualizar la contraseña:', err);
        return reject(new Error('Error al actualizar la contraseña.'));
      }
      resolve();
    });
  });
};


// Buscar usuario por correo electrónico
export const findUserByEmail = (email: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, results: import('mysql2').RowDataPacket[]) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return reject(new Error('Error al buscar usuario.'));
      }
      resolve(results.length > 0 ? results[0] : null);
    });
  });
};
