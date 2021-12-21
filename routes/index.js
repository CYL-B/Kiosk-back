var express = require("express");
var router = express.Router();

var uniqid = require("uniqid");
var fs = require("fs");
var cloudinary = require("cloudinary").v2;

var OfferModel = require("../models/offers");

// route connexion user
router.post("/image", async function (req, res, next) {
  var imagePath = "./tmp/" + uniqid() + ".jpg";
  var resultCopy = await req.files.image.mv(imagePath);

  if (!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(imagePath); // upload + renvoie url cloudinary
// console.log(resultCloudinary);
    if (resultCloudinary.url) {
      fs.unlinkSync(imagePath);
      res.json({
        result: true,
        message: "image uploaded",
        url: resultCloudinary.url,
      });
    }
  } else {
    res.json({ result: false, message: resultCopy });
  }
});

router.post("/rechercheparlabar", async function (req, res, next) {
  var recherche = req.body.recherche;

  var rechercheOffer = await OfferModel.find({
    $or: [
      { offerName: recherche },
      { description: recherche },
      { description: shortDescription },
      { description: shortDescription },
    ],
  });
});

module.exports = router;
