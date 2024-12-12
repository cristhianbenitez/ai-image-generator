import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as authRoutes } from './routes/authRoutes';
import { router as imageRoutes } from './routes/imageRoutes';
import { router as collectionRoutes } from './routes/collectionRoutes';

dotenv.config();

const app: Express = express();

// Increase payload size limit for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
const allowedOrigins = [
  'https://taanga-images.vercel.app',
  'http://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Handle preflight requests
app.options('*', cors());

// Error handling for CORS and large payloads
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS error: Origin not allowed',
      allowedOrigins
    });
  } else if (err instanceof SyntaxError && err.status === 413) {
    res.status(413).json({
      error: 'Payload too large',
      message: 'The image file size is too large. Please use a smaller image (max 50MB).'
    });
  } else {
    next(err);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/collections', collectionRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed CORS origins:', allowedOrigins);
});
