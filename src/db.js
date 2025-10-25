import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI not found in environment variables.");
}
if (!dbName) {
  throw new Error("DB_NAME not found in environment variables.");
}

const client = new MongoClient(uri);
let db;

export async function connectDb() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log(`MongoDB connected: ${db.databaseName}`);
  }
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDb() first.");
  }
  return db;
}
