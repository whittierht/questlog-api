import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import {
  listQuests,
  createQuest,
  getQuestById,
  updateQuest,
  deleteQuest
} from "../controllers/quests.controller.js";

const r = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/** #swagger.tags = ['Quests'] */

r.get("/", listQuests);


r.get(
  "/:id",
  param("id").isMongoId(),
  validate,
  getQuestById
);

r.post(
  "/",
  body("title").isString().trim().notEmpty(),
  body("description").isString().trim().notEmpty(),
  body("difficulty").isIn(["easy", "medium", "hard"]),
  body("category").isString().trim().notEmpty(),
  body("rewardXp").isInt({ min: 1 }),
  body("isDaily").isBoolean(),
  body("dueDate").optional().isISO8601(),
  validate,
  createQuest
);

r.put(
  "/:id",
  param("id").isMongoId(),
  body("title").optional().isString().trim().notEmpty(),
  body("description").optional().isString().trim().notEmpty(),
  body("difficulty").optional().isIn(["easy", "medium", "hard"]),
  body("category").optional().isString().trim().notEmpty(),
  body("rewardXp").optional().isInt({ min: 1 }),
  body("isDaily").optional().isBoolean(),
  body("dueDate").optional().isISO8601(),
  validate,
  updateQuest
);

r.delete(
  "/:id",
  param("id").isMongoId(),
  validate,
  deleteQuest
);

export default r;
