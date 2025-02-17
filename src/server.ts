import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import verifyRoutes from './routes/verifyRoutes';

dotenv.config();

const app = express();
const port = 3002;

app.use(bodyParser.json());

// Rutas de autenticación
app.use('/', authRoutes);
app.use('/', verifyRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
