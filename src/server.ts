import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import studentRoutes from './routes/studentRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Rutas con prefijos
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);

// Middleware de manejo de errores
app.use((err:any, req:any, res:any, next:any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port} 🚀`);
});
