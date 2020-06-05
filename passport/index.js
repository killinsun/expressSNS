import local from "./localStrategy";
import kakao from "./kakaoStrategy";
import db from "../models";

export default (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: { id },
        include: [
          {
            model: db.User,
            attributes: ["id", "nick"],
            as: "Followers",
          },
          {
            model: db.User,
            attributes: ["id", "nick"],
            as: "Followings",
          },
        ],
      });
      if (user) {
        done(null, user);
      }
    } catch (err) {
      done(err);
    }
  });

  local(passport);
  kakao(passport);
};
