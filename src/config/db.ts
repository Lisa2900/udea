import mysql from 'mysql2';

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost', // Asegúrate de que el servidor de MySQL esté corriendo en localhost
  user: 'root', // Tu usuario de MySQL (puede ser diferente)
  password: '', // Si tienes contraseña para 'root', ponla aquí
  database: 'udea', // Reemplaza esto con el nombre de tu base de datos
});

// Establecer la conexión y manejar errores
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión a la base de datos MySQL exitosa.');
});

// Exportar la conexión para utilizarla en otros archivos
export default db;
