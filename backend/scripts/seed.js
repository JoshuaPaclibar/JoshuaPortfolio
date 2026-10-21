import 'dotenv/config';
import mongoose from 'mongoose';
import Project from '../src/models/Project.js';
import projects from '../src/data/projects.js';

// Adds or updates the projects from src/data/projects.js (matched by title). Other projects are left alone.
async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Copy backend/.env.example to backend/.env first.');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    const result = await Project.bulkWrite(
      projects.map((p) => ({ updateOne: { filter: { title: p.title }, update: { $set: p }, upsert: true } })),
    );
    console.log(`Seed complete: ${result.upsertedCount} added, ${result.modifiedCount} updated.`);
  } catch (err) {
    console.error(`Seed failed: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
