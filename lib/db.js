import mongoose from "mongoose";

const cached = globalThis.__weDecorMongoose || { conn: null, promise: null };
globalThis.__weDecorMongoose = cached;

export default async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Database is not configured. Set MONGODB_URI.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false }).then((db) => db);
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
