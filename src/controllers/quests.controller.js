import { ObjectId } from "mongodb";
import { getDb } from "../db.js";

export async function listQuests(req, res, next) {
  try {

    const filter = req.auth ? { ownerId: req.auth.payload.sub } : {};

    const quests = await getDb()
      .collection("quests")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(quests);
  } catch (e) {
    next(e);
  }
}

export async function createQuest(req, res, next) {
  try {
    const ownerId = req.auth?.payload?.sub || null;
    const doc = {
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      category: req.body.category,
      rewardXp: req.body.rewardXp,
      isDaily: req.body.isDaily,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { insertedId } = await getDb().collection("quests").insertOne(doc);

   
    res.status(201).json({ _id: insertedId, id: insertedId, ...doc });
  } catch (e) {
    next(e);
  }
}

export async function getQuestById(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const quest = await getDb().collection("quests").findOne({ _id });
    if (!quest) return res.status(404).json({ message: "Not found" });
    res.json(quest);
  } catch (e) {
    next(e);
  }
}

export async function updateQuest(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }

    const _id = new ObjectId(id);
    const ownerId = req.auth?.payload?.sub;

    const allowed = [
      "title",
      "description",
      "difficulty",
      "category",
      "rewardXp",
      "isDaily",
      "dueDate"
    ];

    const payload = {};
    for (const k of allowed) if (k in req.body) payload[k] = req.body[k];
    if ("dueDate" in payload) {
      payload.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
    }

    const result = await getDb().collection("quests").findOneAndUpdate(
      { _id, ownerId }, 
      { $set: { ...payload, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result.value) return res.status(404).json({ message: "Not found" });
    res.json(result.value);
  } catch (e) {
    console.error("PUT error:", e);
    next(e);
  }
}

export async function deleteQuest(req, res, next) {
  try {
    const _id = new ObjectId(req.params.id);
    const ownerId = req.auth?.payload?.sub;

    const { deletedCount } = await getDb()
      .collection("quests")
      .deleteOne({ _id, ownerId }); 

    if (!deletedCount) return res.status(404).json({ message: "Not found" });
    res.json({ deleted: true });
  } catch (e) {
    next(e);
  }
}
