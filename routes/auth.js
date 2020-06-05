import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";
import db from "../models";

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await db.User.findOne({ where: { email } });
    if (exUser) {
      req.flash("joinError", "이미 가입된 이메일 입니다");
      return res.redirect("/join");
    }
    const hash = await bcrypt.hash(password, 12);
    await db.User.create({ email, nick, password: hash });
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash("loginError", info.message);
      return redirect("/");
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/kakao", passport.authenticate("kakao"));

// no call back for kakao. kakao passport module calls req.login internally
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failWithError: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
