var express = require("express");
var router = express.Router();

var UserModel = require("../models/users");

var bcrypt = require("bcrypt");
var uid2 = require("uid2");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

////// USER //////
// route create user
router.post("/", async function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.json({ result: false, message: "info missing" });
  } else {
    let user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      console.log(req.body);
      let token = uid2(32);
      let newUser = new UserModel({
        email: req.body.email.toLowerCase(),
        password: bcrypt.hashSync(req.body.password, 10),
        token: token,
        type: "client",
        firstName: req.body.firstName ? req.body.firstName : "",
        lastName: req.body.lastName ? req.body.lastName : "",
        role: req.body.role ? req.body.role : "",
        phone: req.body.phone ? req.body.phone : "",
        avatar: req.body.avatar ? req.body.avatar : "",
        companyId: req.body.companyId ? req.body.companyId : "",
      });
      let userSaved = await newUser.save();
      res.json({ result: true, user: userSaved });
    } else {
      res.json({ result: false, message: "email already exists" });
    }
  }
});

// route connexion user
router.post("/connect", async function (req, res, next) {
  let user = await UserModel.findOne({
    email: req.body.email.toLowerCase(),
  });

  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.json({ result: true, user });
    } else {
      res.json({ result: false, message: "password incorrect" });
    }
  } else {
    res.json({ result: false, message: "user not found" });
  }
});

module.exports = router;
