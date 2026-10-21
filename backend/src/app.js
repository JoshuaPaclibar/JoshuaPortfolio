import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { dbState } from './config/db.js';

const app = express();

// Behind a proxy/host (Render, Railway...) the real client IP is needed for rate limiting.
app.set('trust proxy', 1);

app.use(helmet());

// Only the configured frontend origin may call the API from a browser.
// Requests without an Origin header (curl, same-origin proxy, server-to-server) are allowed.
const allowedOrigin = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === allowedOrigin()) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
  }),
);

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', database: dbState(), uptimeSeconds: Math.round(process.uptime()) });
});

app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
