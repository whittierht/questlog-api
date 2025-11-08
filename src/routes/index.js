
import { Router } from "express";
import quests from "./quests.routes.js";
import users from "./users.routes.js";

const api = Router();
api.use("/quests", quests);
api.use("/users", users);

export default api;