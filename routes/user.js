import express from "express";
import { isLoggedIn } from "./middlewares";
import db from "../models";

const router = express.Router();

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await db.User.findOne({ where: { id: req.user.id } });
    await user.addFollowing(parseInt(req.params.id, 10));
    res.send("success");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
