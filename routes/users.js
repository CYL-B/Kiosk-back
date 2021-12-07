var express = require("express");
var router = express.Router();

var UserModel = require("../models/users");
var categoryModel = require("../models/categories");

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
router.post('/recherche', async function(req, res, next){
  var newUser = new UserModel({
    categoryName = "Gerer vos bureaux",
    categoryImage =     "https://images.unsplash.com/photo-1558959356-2f36c7322d3b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
    ,
    subCategories = [{ subCategoryName: "Entretien", subCategoryImage: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
    { subCategoryName: "Equipement IT", subCategoryImage: "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80" },
    { subCategoryName: "Snacks et boissons", subCategoryImage: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
    { subCategoryName: "Café", subCategoryImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1661&q=80" },
    { subCategoryName: "Mobilier", subCategoryImage: "https://images.unsplash.com/photo-1542360915390-e1a7b3ce8865?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80" },
    { subCategoryName: "Recyclage", subCategoryImage: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },]
   });
   var userSaved = await newUser.save();
 })
 
module.exports = router;
