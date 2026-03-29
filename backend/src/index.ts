import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { initFirebase } from './services/firestore';
import { errorHandler } from './middleware/errorHandler';

// Routes
import announcementRoutes from './routes/announcements';
import eventRoutes        from './routes/events';
import documentRoutes     from './routes/documents';
import contactRoutes      from './routes/contact';
import requestRoutes      from './routes/requests';
import evaluationRoutes   from './routes/evaluations';
import scsRoutes          from './routes/scs';

// Init Firebase Admin
initFirebase();

const app = express();
const PORT = process.env.PORT ?? 5000;

// ── Security & logging ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limit — 100 req / 15 min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/announcements', announcementRoutes);
app.use('/api/events',        eventRoutes);
app.use('/api/documents',     documentRoutes);
app.use('/api/contact',       contactRoutes);
app.use('/api/requests',      requestRoutes);
app.use('/api/evaluations',   evaluationRoutes);
app.use('/api/scs',           scsRoutes);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅  GNHS SSLG API running on http://localhost:${PORT}`);
});

export default app;
