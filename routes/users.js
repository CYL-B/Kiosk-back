var express = require("express");
var router = express.Router();

var UserModel = require("../models/users");

var bcrypt = require("bcrypt");
var uid2 = require("uid2");

var uniqid = require('uniqid');
var fs = require('fs');

var request = require('sync-request');

var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'djlnzwuj2',
  api_key: '657221472726422',
  api_secret: '_9NiMZQkKdOIXM-GQqpAzrYu6TE'
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

////// USER //////
// route create user
<<<<<<< HEAD
router.post('/', async function(req, res,next){
  console.log('req.body /users');
  console.log(req.body);
  if(!req.body.email || !req.body.password) {
    res.json({result: false, message: 'info missing'});
=======
router.post("/", async function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.json({ result: false, message: "info missing" });
>>>>>>> routesearch
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
<<<<<<< HEAD
        type: req.body.type ? req.body.type : '',
        firstName: req.body.firstName ? req.body.firstName : '',
        lastName: req.body.lastName ? req.body.lastName : '',
        role: req.body.role ? req.body.role : '',
        phone: req.body.phone ? req.body.phone : '',
        avatar: req.body.avatar ? req.body.avatar : '',
        companyId: req.body.companyId ? req.body.companyId : ''
=======
        type: "client",
        firstName: req.body.firstName ? req.body.firstName : "",
        lastName: req.body.lastName ? req.body.lastName : "",
        role: req.body.role ? req.body.role : "",
        phone: req.body.phone ? req.body.phone : "",
        avatar: req.body.avatar ? req.body.avatar : "",
        companyId: req.body.companyId ? req.body.companyId : "",
>>>>>>> routesearch
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

// route connexion user
router.post('/avatar', async function(req, res,next){
  console.log(req.files);
  var imagePath = './tmp/' + uniqid() + '.jpg';
  var resultCopy = await req.files.avatar.mv(imagePath);

  if (!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(imagePath);
    console.log(resultCloudinary);
    if (resultCloudinary.url) {
      fs.unlinkSync(imagePath);
      res.json({ result: true, message: 'image uploaded', url: resultCloudinary.url });
    }

  } else {
    res.json({ result: false, message: resultCopy });
  }
})

module.exports = router;
