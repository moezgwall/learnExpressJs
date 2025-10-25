const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { USER_LIST } = require("./DATA/USERS_LIST");
require("dotenv").config();
const dburl = process.env.DB_URL;
const router = require("/zeus/bigproject/router/user_router");
const auth = require("/zeus/bigproject/middleware/authMiddlewares");

const session = require("express-session");

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:3000; style-src 'self' 'unsafe-inline'"
  );

  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/uploads/voices",
  express.static(path.join(__dirname, "uploads/voices"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.SESSION_CODE,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set this to true in case of using HTTPS
  })
);
app.use("/api/v1", router);

app.get("/", (req, res) => {
  return res.send("get//working");
});

mongoose
  .connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected with success to the DB."))
  .catch((err) => console.error("connection to the DB failed", err));

app.listen(PORT, () => {
  console.log(`sv: http://localhost:${PORT}`);
});
