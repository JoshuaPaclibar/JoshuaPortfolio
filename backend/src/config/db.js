import mongoose from 'mongoose';

const RETRY_DELAY_MS = 10_000;

/** True only when Mongoose has an open connection (readyState 1). */
export const isDbConnected = () => mongoose.connection.readyState === 1;

/** Human-readable state, used by GET /api/health. */
export const dbState = () =>
  ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] ??
  'unknown';

/**
 * Connects to MongoDB. If the first attempt fails, the error is logged loudly
 * (never hidden) and the connection is retried every 10 seconds, so the API can
 * still start and report the problem through /api/health and 503 responses.
 */
export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    console.error('[db] MONGODB_URI is not set. Copy backend/.env.example to backend/.env first.');
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[db] MongoDB connected');
    return true;
  } catch (err) {
    console.error(`[db] MongoDB connection failed: ${err.message}`);
    console.error(`[db] Retrying in ${RETRY_DELAY_MS / 1000}s. Is MongoDB running / is MONGODB_URI correct?`);
    setTimeout(() => connectDB(uri), RETRY_DELAY_MS).unref();
    return false;
  }
}
