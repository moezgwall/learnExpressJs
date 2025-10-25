const express = require("express");
const mongoose = require("mongoose");
const Users = require("../DATA/db_schema");

async function removeUser(req, res, next) {
  const { d_username } = req.body;

  if (!d_username) {
    return res.status(400).json({ message: "USERNAME IS NULL" });
  }
  try {
    const user = await Users.findOne({ d_username });
    if (!user) {
      return res
        .status(404)
        .json({ message: "FAILED TO FETCH USER OR USER NOT FOUND" });
    }

    await Users.deleteOne({ d_username });
    return res.status(200).json({ message: "USER HAS BEEN DELETED" });
  } catch (err) {
    return res.status(500).json({
      message: "EXCEPTION LAUNCHED BY @REMOVE USER WITH ERROR:",
      error: err.message,
    });
  }
}

async function getUserLists(req, res, next) {
  try {
    const userList = await Users.find({}, "username email dob");

    return res.render("dashboard", {
      users: userList,
      username: req.session.user.username,
    });
  } catch (error) {
    return res.status(500).json({ message: "ERROR ", error: error.message });
  }
}

module.exports = { removeUser, getUserLists };
