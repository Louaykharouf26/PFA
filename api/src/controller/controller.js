const express = require("express");
require("../config/config");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

module.exports.getDefault = (req, res) => {
  console.log("hello for get request");
  res.send("hello for test request");
};

module.exports.createUser = async (req, res) => {
  const { username, firstname, lastname, email, password, subscription_id } =
    req.body;
  User.findOne({ email })
    .then((response) => {
      if (response == null) {
        User.create({
          username,
          firstname,
          lastname,
          email,
          password,
          subscription_id,
        })
          .then((response) => {
            res.send("User added successfully to database");
            res.status(200);
          })
          .catch((err) => console.log(err));
      } else {
        res.status(400);
        res.send("User is already in the database");
      }
    })
    .catch((err) => console.log(err));
};

//jwt token creation for user
const maxAge = 700 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    var auth;
    if (md5(password) === user.password) auth = true;
    else {
      res.send("Wrong password please retype it again");
      auth = false;
    }
    if (auth) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { maxAge: maxAge * 1000, httpOnly: true });
      console.log(JSON.stringify({ id: user._id.valueOf() }));
      res
        .status(200)
        .send(JSON.stringify({ id: user._id.valueOf(), name: user.firstname }));
    }
  } else {
    res.status(400);
    res.send("Wrong username please retype it again");
  }
};

module.exports.getUserByUsername = async (req, res) => {
  const username = req.body.username;
  const user = await User.findOne({ username });
  if (user) {
    //res.send(user)
    res.send(JSON.stringify(user));
  } else {
    res.send("User not found, please recheck the username");
  }
};