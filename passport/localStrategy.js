import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "../models";

export default (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const exUser = await db.User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다" });
            }
          } else {
            done(null, false, "가입되지 않은 회원입니다.");
          }
        } catch (err) {
          console.error(err);
          done(error);
        }
      }
    )
  );
};
