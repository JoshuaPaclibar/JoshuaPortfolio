import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`[server] API running at http://localhost:${PORT}/api (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
});

// The API starts even if MongoDB is down; connectDB logs the problem and keeps retrying.
connectDB();
