import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function connectDb() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("MongoDB connected:", process.env.DB_NAME);
  }
  return db;
}
export function getDb() {
  if (!db) throw new Error("DB not initialized");
  return db;
}
