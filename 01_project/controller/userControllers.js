// POST method for login for users
require("dotenv").config();
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
//const { USER_LIST, User } = require("../DATA/USERS_LIST");
const jwt_code = process.env.JWT_SECRET;
const Users = require("../DATA/db_schema");
const path = require("path");

const voiceMessage = require("../DATA/voiceMsg");

console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Missing");
if (!jwt_code) {
  throw new Error("FAILED TO LOAD THE JWT CODE");
}

async function userSignup(req, res, next) {
  try {
    const { username, email, dob, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "REQUIRED FIELDS ARE MISSING" });
    }
    const emailExist = await Users.findOne({ email });
    const usernameExist = await Users.findOne({ username });
    if (emailExist) {
      return res.status(400).json({ message: "EMAIL ALREADY REGISTRED" });
    } else if (usernameExist) {
      return res.status(400).json({ message: "USERNAME ALREADY REGISTRED" });
    }

    // we expect them to be in a good format

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: "EMAIL BAD FORMAT OR EMPTY FIELD" });
    }
    if (
      !username ||
      !validator.isLength(username, { min: 6, max: 10 }) ||
      !validator.isAlphanumeric(username)
    ) {
      return res
        .status(400)
        .json({ error: "USERNAME BAD FORMAT OR EMPTY FIELD" });
    }
    // crypt the password
    const hashpassword = await bcrypt.hash(password, 10);
    // create a user in the DB
    const new_user = await Users.create({
      username,
      email,
      dob,
      password: hashpassword,
      role: "user",
    });

    // const nuser = User.CreateNewUser(payload);
    // generate a token for each user
    // base on the id , role it expires in "1h"
    const token = jwt.sign(
      { userid: new_user.id, role: new_user.role },
      jwt_code,
      { expiresIn: "1h" }
    );

    //return res.status(201).json({ message: "operation success", token });
    // as a response , you render a whole EJS file called main
    res.render("main", { username: new_user.username, data: [] });
  } catch (err) {
    return res.status(500).json({
      message: "EXCEPTION LAUNCHED BY @SIGNUP WITH ERROR:",
      error: err.message,
    });
  }
}

async function userLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    // verify if email and passwrod are valid
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "SOME REQUIRED FIELDS ARE MISSING" });
    }
    // look for the user by "email"
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "USER DOESNT EXIST" });
    }
    // check if he have a password stored in the DB
    if (!user.password) {
      return res.status(500).json({ message: "PASSWORD NOT SET BY USER" });
    }

    // now compare the hash
    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(401).json({ message: "PASSWORD INCORRECT" });
    }
    // create a session for the user
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role, // e.g., 'admin' or 'user'
      email: user.email,
      password: user.password,
    };
    // create a new fresh token
    const freshToken = jwt.sign(
      { userid: user.id, role: user.role },
      jwt_code,
      { expiresIn: "1h" }
    );

    //  return res
    //  .status(200)
    //  .json({ message: "loggin sucess", token: freshToken });

    // check the role of the user
    // to load a specific EJS module for each role
    if (req.session.user.role === "admin") {
      return res.render("dashboard", {
        username: req.session.user.username,
        users: [],
      });
    }

    return res.render("profile", {
      username: req.session.user.username,
      email: req.session.user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "operation failed", error: err.message });
  }
}

// function to update user password
async function updateInfo(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "ACCESS DENIED" });
  }

  const { password } = req.body;
  if (!password) {
    return res.status(401).json({ message: "PASSWORD REQUIRED" });
  }
  const hashpassword = await bcrypt.hash(password, 10);
  try {
    await Users.findByIdAndUpdate(req.session.user.id, {
      password: hashpassword,
    });

    const updatedUser = await Users.findById(req.session.user.id);
    console.log("New password hash:", updatedUser.password);
    return res.redirect("/login.html");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
// POST
async function sendVoiceMessage(req, res, next) {
  if (!req.session.user)
    return res.status(401).json({ message: "ACCESS DENIED" });

  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username required" });
  if (!req.file)
    return res.status(400).json({ message: "No voice message uploaded" });

  try {
    const receiver = await Users.findOne({ username });
    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });

    const dataSend = await voiceMessage.create({
      sender: req.session.user.id,
      receiver: receiver._id,
      audioUrl: `/uploads/voices/${req.file.filename}`, // public URL path
      sendAT: new Date(),
    });

    return res
      .status(201)
      .json({ message: "Voice message sent successfully", data: dataSend });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Operation failed", error: error.message });
  }
}

// GET

async function getVoiceMessage(req, res, next) {
  if (!req.session.user)
    return res.status(401).json({ message: "ACCESS DENIED" });

  try {
    const messages = await voiceMessage
      .find({ receiver: req.session.user.id })
      .populate("sender", "username") // only username needed
      .sort({ createdAt: -1 });

    return res.render("main", {
      username: req.session.user.username,
      data: messages,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch messages", error: error.message });
  }
}

module.exports = {
  userSignup,
  userLogin,
  updateInfo,
  sendVoiceMessage,
  getVoiceMessage,
};
