var express = require("express");
var router = express.Router();

var uniqid = require("uniqid");
var fs = require("fs");
var cloudinary = require("cloudinary").v2;

// route connexion user
router.post("/image", async function (req, res, next) {
  var imagePath = "./tmp/" + uniqid() + ".jpg";
  var resultCopy = await req.files.image.mv(imagePath);

  if (!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(imagePath); // upload + renvoie url cloudinary
    
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

module.exports = router;
