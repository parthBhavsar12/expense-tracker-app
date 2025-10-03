/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_NAME,
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
