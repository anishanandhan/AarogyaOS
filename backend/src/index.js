import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Enforce Centralized Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' https://*.googleapis.com https://speech.googleapis.com https://texttospeech.googleapis.com https://translation.googleapis.com; img-src 'self' data: https://*.googleapis.com https://*.google.com https://*.gstatic.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests"
  );
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=(self)');
  next();
});

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://aarogyaos.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set body parsers (with 10MB limit for base64 images)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Express Rate Limiting (Max 150 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  message: { error: 'Too many API requests from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter to all API endpoints
app.use('/api/v1', apiLimiter);

// Bind routes
app.use('/api/v1', apiRouter);

// Global Error Handler for Graceful Degradation
app.use((err, req, res, next) => {
  console.error('[Backend Global Error]:', err.stack || err.message || err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected server-side error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` AarogyaOS Secure Backend running on port ${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api/v1`);
  console.log(`===============================================`);
});
