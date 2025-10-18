import { Router } from "express";
import quests from "./quests.routes.js";
const api = Router();
api.use("/quests", quests);
export default api;
