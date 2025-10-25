const express = require("express");
const router = express.Router();
const user_module = require("../controller/userControllers");
const authmiddle = require("../middleware/authMiddlewares");
const admin_module = require("../controller/adminControllers");
const voiceMessage = require("../DATA/voiceMsg");
const multerConfig = require("../middleware/multerConfig");

const multer = require("multer");

// Set up Multer storage configuration
const upload = multer({ dest: "uploads/voices/" });

// list of user routes

router.post("/signup", user_module.userSignup);
router.post("/login", user_module.userLogin);

router.get("/main", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "SESSION NOT VALID" });
  }

  return res.render("main", { username: req.session.user.username, data: [] });
});
/* router.get(
  "/dashboard",
  authmiddle.isAdmin,
  authmiddle.protectRoute,
  (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "SESSION NOT VALID" });
    }
    res.status(200).json({ message: "ACCESS TO DASHBOARD FOR ADMIN" });
  }
); */

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "FAILED TO LOGOUT" });
    }
    res.clearCookie("connect.sid"); // Optional: clear session cookie
    return res.redirect("/login.html");
  });
});

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  res.render("profile", {
    username: req.session.user.username,
    email: req.session.user.email,
  });
});
// send voice message
router.post(
  "/voicesender",
  multerConfig.single("voiceMSG"),
  user_module.sendVoiceMessage
);
router.get("/getvoice", user_module.getVoiceMessage);

/* router.get("/home", (req, res) => {
  res.render("main", {
    username: req.session.user.username,
  }); // renders main.ejs
}); */

/* router.get("/profile", (req, res) => {
  res.render("profile", {
    username: req.session.user.username,
    email: req.session.user.email,
  }); // renders profile.ejs
}); */

router.get("/dashboard", authmiddle.isAdmin, (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "SESSION NOT VALID" });
  }
  res.render("dashboard", {
    username: req.session.user.username,
    users: [],
  }); // renders dashboard.ejs
});

router.get("/allusers", authmiddle.isAdmin, admin_module.getUserLists);

router.post("/update-user", user_module.updateInfo);
module.exports = router;
