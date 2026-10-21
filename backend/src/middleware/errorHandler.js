/**
 * Central error handler. Every `next(err)` and every thrown error in a route ends up here,
 * so responses always have the same JSON shape: { success: false, message }.
 */
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  // Invalid JSON in the request body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body is not valid JSON.' });
  }
  // Body larger than the configured limit
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body is too large.' });
  }
  // CORS rejection (see app.js)
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'This origin is not allowed by CORS.' });
  }
  // Mongoose validation / cast problems are the client's fault
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Validation failed.', errors: Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message])) });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid identifier.' });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error('[error]', err);

  res.status(status).json({
    success: false,
    // Never leak internal error details in production
    message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message || 'Internal server error.',
  });
}
