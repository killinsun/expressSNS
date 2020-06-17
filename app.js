import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import helmet from "helmet";
import hpp from "hpp";
import _ from "./env";
import pageRouter from "./routes/page";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import userRouter from "./routes/user";
import db from "./models";
import passportConfig from "./passport";
import logger2 from "./logger";

const RedisStore = require("connect-redis")(session);

const app = express();
db.sequelize.sync();
passportConfig(passport);

const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || "secretkey";
const sessionOpts = {
  resave: false,
  saveUninitialized: false,
  secret: COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
    logErrors: true,
  }),
};

if (process.env.NODE_ENV === "production") {
  sessionOpts.proxy = true;
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("port", PORT);

if (process.env.NODE_ENV === "production") {
  app.use(logger("combined"));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(logger("dev"));
}
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // extended false : using querystring in node, extended true: using qs module
app.use(cookieParser(COOKIE_SECRET));
app.use(session(sessionOpts));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  logger2.info("Not Found");
  logger2.error(err.message);
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
