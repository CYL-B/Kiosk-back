var express = require("express");
var router = express.Router();

var CompanyModel = require("../models/companies");
var labelModel = require("../models/labels");
var OfferModel = require("../models/offers");
var UserModel = require("../models/users");

var uniqid = require("uniqid");
var fs = require("fs");

var cloudinary = require("cloudinary").v2;

////// PAGE ENTREPRISE //////
// route affichage infos inscription entreprise
router.get("/:companyId/:token", async function (req, res, next) {
  // /route/params?query
  let token = req.params.token;
  // console.log("companyiD", req.params.token, req.params.companyId);
  if (!token) {
    res.json({ result: false });
  } else {
    var company = await CompanyModel.findById(req.params.companyId)
      .populate("labels")
      .populate("offers")
      .exec();
    //console.log("company", company.labels);
    //console.log("company", company);
    res.json({ result: true, company });
  }
});

// route envoi infos inscirption entreprise
router.post("/", async function (req, res, next) {
  if (!req.body.companyName) {
    res.json({ result: false, message: "company info missing" });
  } else {
    let company = await CompanyModel.findOne({
      companyName: req.body.companyName,
    });
    if (!company) {
      //console.log(req.body);
      let newCompany = new CompanyModel({
        companyName: req.body.companyName,
        address: req.body.address ? req.body.address : "",
        siret: req.body.siret ? req.body.siret : "",
        type: req.body.type ? req.body.type : "",
      });
      let companySaved = await newCompany.save();
      res.json({ result: true, company: companySaved });
    } else {
      res.json({ result: false, message: "company already exists" });
    }
  }
});

// route affichage labels sur page company blank
router.get("/labels", async function (req, res, next) {
  // /route/params?query
  var dataLabels = await labelModel.find();
  //console.log("dataLabels", dataLabels);
  res.json({ result: true, dataLabels });
});

// route rajout infos + labels page entreprise
router.put("/:companyId", async function (req, res, next) {
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    var dataCie = await CompanyModel.findOne({ _id: req.params.companyId }); // recupération data company de DB par ID
    // console.log("dataCie", dataCie)
    if (req.body.labelId) {
      //////////////
      const labelFound = dataCie.labels.filter(
        (label) => label._id == req.body.labelId
      ); // on check si le label a deja ete ajouté
      labelFound.length === 0 && dataCie.labels.push(req.body.labelId); // si il n'a pas été trouvé, on l'ajoute
    }

    if (req.body.description) {
      dataCie.description = req.body.description;
      dataCie.shortDescription = req.body.description;
    }

    let offerSaved;
    if (req.body.offerName) {
      let newOffer = new OfferModel({
        // vréation nouvelle offre
        offerName: req.body.offerName,
      });
      offerSaved = await newOffer.save();
      dataCie.offers.push(offerSaved._id); // on push la nouvelle offre via son id dans la cie
    }

    if (req.body.image) {
      dataCie.companyImage = req.body.image;
    }
    // console.log("dataCie", dataCie)
    await dataCie.save();
    var dataCieFull = await CompanyModel.findOne({ _id: req.params.companyId })
      .populate("labels")
      .populate("offers")
      .exec();
    // console.log("dataCieFull", dataCieFull)
    // console.log("dataCie", dataCie);
    res.json({ result: true, dataCieFull, offerSaved });
  }
});

// route affichage labels sur page company blank
router.get("/labels", async function (req, res, next) {
  // /route/params?query
  var dataLabels = await labelModel.find();
  // console.log("dataLabels", dataLabels);
  res.json({ result: true, dataLabels });
});

// route suppression labels sur page company filled
router.put("/labels/:companyId/:labelId", async function (req, res, next) {
  // /route/params?query
  await CompanyModel.updateOne(
    { _id: req.params.companyId },
    { $pull: { labels: req.params.labelId } }
  );
  var dataLabelsCieUpdated = await CompanyModel.findOne({
    _id: req.params.companyId,
  })
    .populate("labels")
    .populate("offers")
    .exec();
  res.json({ result: true, dataLabelsCieUpdated });
});

// route to like a company
router.post("/like", async function (req, res, next) {
  let token = req.body.token;
  if (!token) {
    res.json({ result: false });
  } else {
    var user = await UserModel.findById(req.body.userId);
    if(req.body.companyId) {
      if(user.favorites.some(e => e.companyId && e.companyId == req.body.companyId)) {
        user.favorites = user.favorites.filter(e => e.offerId || ( e.companyId && e.companyId != req.body.companyId ));
      } else {
        user.favorites.push({ companyId: req.body.companyId });
      }
    }
    await user.save();
    user = await UserModel.findById(req.body.userId);
    res.json({ result: true, user });
  }
});

////// PAGE PROFIL ENTREPRISE //////

router.get("/profile/:token/:companyId", async function (req, res, next){

  var token = req.params.token
  var companyId = req.params.companyId

  if (!token) {
    res.json({ result: false });}else{


  var company = await CompanyModel.findById(companyId)
console.log("company", company)

var siret = company.siret
var companyName = company.companyName
var logo = company.logo
console.log("logo", companyName)

  res.json({ result: true, siret, companyName,logo});}

})

router.post("/logo", async function(req, res, next){

  console.log(req.files);
  var imagePath = "./tmp/" + uniqid() + ".jpg";
  var resultCopy = await req.files.logo.mv(imagePath);

  if (!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(imagePath);
    console.log(resultCloudinary);
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


  res.json({ result: true, siret, companyName})
})


router.put("/update-company", async function (req, res, next){

  var token = req.body.token;
  
  if (!token) {
    res.json({ result: false });}else{

  var updateCompany = await CompanyModel.updateOne({_id: req.body.companyId},{
    companyName : req.body.companyName,
    logo: req.body.logo,
    siret : req.body.siret
  }

  );

  if (updateCompany) {
    var companyData = await CompanyModel.findOne({ id: req.body.companyId });
    console.log(companyData);
    res.json({ result: true, companyData });
  } else {
    res.json({ result: false });
  }}
})
module.exports = router;
