import express from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import otpRoutes from './routes/otp.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

/**
 * Normalize origin (remove trailing slash)
 */
const normalizeOrigin = (url: string) => url.replace(/\/$/, '');

/**
 * Allowed origins
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.FRONTEND_URL
    ? [normalizeOrigin(process.env.FRONTEND_URL)]
    : [])
];

console.log('✅ Allowed Origins:', allowedOrigins);

/**
 * Single source of truth for CORS
 */
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser clients

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.error('❌ CORS Blocked:', normalizedOrigin);
      callback(new Error(`Not allowed by CORS: ${normalizedOrigin}`));
    }
  },
  credentials: true
};

/**
 * Apply CORS globally
 */
app.use(cors(corsOptions));

/**
 * Middlewares
 */
app.use(express.json({ limit: '5mb' }));

/**
 * Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);

export default app;
