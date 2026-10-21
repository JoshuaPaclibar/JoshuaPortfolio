import { isDbConnected } from '../config/db.js';

/**
 * Stops a request early with a clear 503 when MongoDB is not connected.
 * Without this, Mongoose would silently wait (buffer) for ~10 seconds and then fail.
 */
export default function requireDb(req, res, next) {
  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database is not available right now. Please try again later.',
    });
  }
  next();
}
