import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import api from "./routes/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, "./swagger/swagger.json");
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("QuestLog API running"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));


app.use("/api", api);

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () =>
      console.log(`Server running at: http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

start();
