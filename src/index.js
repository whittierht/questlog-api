import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { connectDb } from "./db.js";
import questsRouter from "./routes/quests.routes.js";
import usersRouter from "./routes/users.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

const swaggerPath = path.join(__dirname, "swagger", "swagger.json");
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/quests", questsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = Number(err.status) || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 3000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on ${PORT}`);
      console.log(`Swagger at /api-docs`);
    });
  })
  .catch((e) => {
    console.error("Failed to start server:", e);
    process.exit(1);
  });

export default app;
