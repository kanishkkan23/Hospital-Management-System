import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/config.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Enable CORS for frontend communication
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman) or matching frontend
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === config.frontendUrl) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for local development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-email', 'x-demo-email']
}));

// HTTP Request Logger
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'CarePoint Hospital Management System API',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/health'
  });
});

// Mount Main API Router
app.use('/api', apiRoutes);

// 404 Catch-all handler
app.use(notFoundHandler);

// Centralized Error handling middleware
app.use(errorHandler);

export default app;
