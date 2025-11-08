
import { Router } from "express";
import { body, validationResult } from "express-validator";
import { requireAuth } from "../middleware/requireAuth.js";
import { getMe, updateMe, leaderboard } from "../controllers/users.controller.js";

const r = Router();
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

/** #swagger.tags = ['Users'] */

r.get("/me", requireAuth, getMe);
r.put(
  "/me",
  requireAuth,
  body("displayName").optional().isString().trim().isLength({ min: 1, max: 100 }),
  body("settings").optional().isObject(),
  body("xp").optional().isInt({ min: 0 }),
  body("level").optional().isInt({ min: 1 }),
  validate,
  updateMe
);



r.get("/leaderboard", leaderboard);

export default r;
