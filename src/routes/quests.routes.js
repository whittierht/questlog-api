import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { listQuests, createQuest, getQuestById } from "../controllers/quests.controller.js";

const r = Router();

/** #swagger.tags = ['Quests'] */

r.get("/", listQuests);

r.get("/:id", param("id").isMongoId(), getQuestById);

r.post("/",
  body("title").isString().trim().notEmpty(),
  body("description").isString().trim().notEmpty(),
  body("difficulty").isIn(["easy", "medium", "hard"]),
  body("category").isString().trim().notEmpty(),
  body("rewardXp").isInt({ min: 1 }),
  body("isDaily").isBoolean(),
  body("dueDate").optional().isISO8601(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  createQuest
);

export default r;
