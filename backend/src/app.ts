import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import errorHandler from './middleware/errorHandler';
import serverRouter from './routes/server_routes';
import roomRouter from './routes/rooms.route';
import messageRouter from './routes/messages.route';
import authRouter from './routes/auth.route';
const app = express();

const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/auth', authRouter);
app.use('/rooms', roomRouter);
app.use('/messages', messageRouter); 
app.use('/api', serverRouter); // Main API routes


// Error Handler Middleware
app.use(errorHandler);

export default app;