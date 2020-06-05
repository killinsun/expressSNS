import express from "express";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";
import db from "../models";

const router = express.Router();

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "my info", user: req.user });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: "Sing up",
    user: req.user,
    joinError: req.flash("joinError"),
  });
});

router.get("/", (req, res, next) => {
  console.log(req.user);
  db.Post.findAll({
    include: {
      model: db.User,
      attributes: ["id", "nick"],
    },
    order: [["createdAt", "DESC"]],
  })
    .then((posts) => {
      res.render("main", {
        title: "NodeSNS",
        twits: posts,
        user: req.user,
        loginError: req.flash("loginError"),
      });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
  //   res.render("profile", { title: "my info", user: req.user });
});

export default router;
