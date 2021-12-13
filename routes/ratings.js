var express = require("express");
var router = express.Router();

var ratingModel = require('../models/ratings');
var CompanyModel = require('../models/companies');
var UserModel = require("../models/users");
const userModel = require("../models/users");

// route affichage ???????
router.get('/:companyId/:token', async function (req, res, next) { // /route/params?query
    let token = req.params.token;
// console.log("companyiD", req.params.token, req.params.companyId);
    if (!token) {
        res.json({ result: false });
    } else {
        var ratings = await ratingModel.find().populate("userId").populate("clientId").exec();
console.log("ratings", ratings);
// console.log('ratings.user._id', ratings.users._id);
        res.json({ result: true, ratings });
    }
});

module.exports = router;