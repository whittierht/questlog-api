
import { getDb } from "../db.js";

export async function getMe(req, res, next) {
  try {
    const sub = req.auth?.payload?.sub;
    if (!sub) return res.status(401).json({ message: "Unauthorized" });

    const users = getDb().collection("users");
    let me = await users.findOne({ sub });

    if (!me) {
      me = {
        sub,
        displayName: req.auth.payload.name || null,
        email: req.auth.payload.email || null,
        xp: 0,
        level: 1,
        settings: { theme: "light", notifications: true },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await users.insertOne(me);
    }
    res.json(me);
  } catch (e) { next(e); }
}

export async function updateMe(req, res, next) {
  try {
    const sub = req.auth?.payload?.sub;
    if (!sub) return res.status(401).json({ message: "Unauthorized" });

    const payload = {};
    const allowed = ["displayName", "settings", "xp", "level"];
    for (const k of allowed) if (k in req.body) payload[k] = req.body[k];
    payload.updatedAt = new Date();

    const users = getDb().collection("users");
    const result = await users.findOneAndUpdate(
      { sub },
      { $set: payload },
      { returnDocument: "after", upsert: true }
    );
    res.json(result.value);
  } catch (e) { next(e); }
}



export async function leaderboard(req, res, next) {
  try {
    const top = await getDb()
      .collection("users")
      .find({}, { projection: { _id: 0, sub: 1, displayName: 1, xp: 1, level: 1 } })
      .sort({ xp: -1, level: -1 })
      .limit(25)
      .toArray();
    res.json(top);
  } catch (e) { next(e); }
}
