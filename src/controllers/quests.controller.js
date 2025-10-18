import { ObjectId } from "mongodb";
import { getDb } from "../db.js";

export async function listQuests(req, res, next) {
  try {
    const quests = await getDb().collection("quests").find().toArray();
    res.json(quests);
  } catch (e) { next(e); }
}

export async function createQuest(req, res, next) {
  try {
    const doc = {
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      category: req.body.category,
      rewardXp: req.body.rewardXp,
      isDaily: req.body.isDaily,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      createdAt: new Date(), updatedAt: new Date()
    };
    const result = await getDb().collection("quests").insertOne(doc);
    res.status(201).json({ id: result.insertedId, ...doc });
  } catch (e) { next(e); }
}

export async function getQuestById(req, res, next) {
  try {
    const item = await getDb().collection("quests")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) { next(e); }
}
