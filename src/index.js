const { config } = require("dotenv");
const { join, resolve } = require("path");

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const express = require("express");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const redisStore = require("connect-redis")(session);
const colors = require("colors");
const morgan = require("morgan");
const redisServer = require("redis-server");

const connectDB = require("./config/db");
const teamsRoute = require("./routes/teamsRoute");
const fixtureRoute = require("./routes/fixturesRoute");
const usersRoute = require("./routes/usersRoute");
const searchRoute = require("./routes/searchRoute");
const client = require("./utils/redis");

config();

connectDB();

colors.enable();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

client.on("connect", () => {
  console.log("[redis]: connected to redis".cyan.bold);
});

// app.use(
//   session({
//     secret: "ssshhhhh",
//     name: "sportex",
//     cookie: { secure: false },
//     // create new redis store.
//     store: new redisStore({
//       host: "localhost",
//       port: 6379,
//       client,
//       ttl: 86400,
//     }),
//     saveUninitialized: false,
//     resave: false,
//   })
// );

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
// Prevent XSS attack
app.use(xss());
app.use(helmet());
app.use(limiter);

app.use("/api/users", usersRoute);
app.use("/api/teams", teamsRoute);
app.use("/api/fixtures", fixtureRoute);
app.use("/api", searchRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "/public")));

  app.get("*", (req, res) =>
    res.sendFile(resolve(__dirname, "public", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

module.exports = app;
