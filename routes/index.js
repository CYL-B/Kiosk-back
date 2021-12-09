var express = require("express");
var router = express.Router();

var uniqid = require('uniqid');
var fs = require('fs');
var cloudinary = require('cloudinary').v2;

var CompanyModel = require("../models/companies");
var CategoryModel = require("../models/categories");
var OfferModel = require("../models/offers");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

////// SEARCH //////
// route affichage catégories
router.get("/categories", function (req, res, next) {
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // FROM DB TO FRONT dans {categories} : Récupération de toutes les catégories
    res.json({ result: true, categories });
  }
});

// route affichage sub-catégories
router.get("/categories/:categorieID", function (req, res, next) {
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // FROM DB TO FRONT dans {subCategories} : Récupération des sous-catégories
    res.json({ result: true, subCategories });
  }
});

// route affichage offres selon critères recherche
router.get("/search", function (req, res, next) {
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Récupération offres selon critères recherche
    // récupère pour critères de recherche :
    // FROM FRONT : catégories / subCaterories / contenu input search / city
    // TO FRONT dans {offers} : ratings + logo entreprise (populate via companyID)
    res.json({ result: true, offers });
  }
});

router.get("/getcategories", async function (req, res, next) {
  var categorieList = await CategoryModel.find();
  if (categorieList) {
    res.json({ result: true, categorieList });
  } else {
    res.json({ result: true });
  }
});

router.post("/recherche", async function (req, res, next) {
  //Recherche en selectionant catégorie puis subcategorie

  //var subcategorie = "61af73b7d3a79c53397e9741";
  var subcategorieId = req.body.subcategorieId;
  var categorieId = req.body.categorieId;

  console.log(subcategorieId);
  console.log(categorieId);

  if (subcategorieId === categorieId) {
    var offerList = await OfferModel.find({ categoriyId: categorieId });
  } else {
    var offerList = await OfferModel.find({ subCategoriyId: subcategorieId });
  }

  for (var i = 0; i < offerList.length; i++) {
    var companyData = await CompanyModel.find({
      offers: offerList[i]._id,
    });
    //console.log(companyData);
    offerList[i] = { ...offerList[i].toJSON() };
    offerList[i].companyData = companyData;
  }

  console.log(offerList);
  if (offerList) {
    res.json({ result: true, offerList });
  } else {
    res.json({ result: false });
  }
});

// route connexion user
router.post('/image', async function(req, res,next){
  console.log(req.files);
  var imagePath = './tmp/' + uniqid() + '.jpg';
  var resultCopy = await req.files.image.mv(imagePath);

  if (!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(imagePath); // upload + renvoie url cloudinary
    console.log(resultCloudinary);
    if (resultCloudinary.url) {
      fs.unlinkSync(imagePath);
      res.json({ result: true, message: 'image uploaded', url: resultCloudinary.url });
    }

  } else {
    res.json({ result: false, message: resultCopy });
  }
})
//route pour ajouter à la main une company
router.get("/ajoutcompany", async function (req, res, next) {
  var newCompagny = new companyModel({
    siret: "9999999999",
    companyName: "CompanyTest1",
    logo: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80",
    type: "Prestataire",
    description: "Description company 1",
    shortDescription: "ShortDescription company 1",
    website: "https://www.google.fr/",
    companyImage:
      "https://images.unsplash.com/photo-1495314736024-fa5e4b37b979?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80",

    offers: [
      "61af78bc4292b4fe7bf8a1d9",
      "61af79470346488ca041da0c",
      "61af796c6f3e101baa8b7cd1",
      "61af79a9c3c2ce891515a112",
      "61af7a09cec6028d366c7cf5",
    ],
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Paris",
        postalCode: "70017",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var saveCompany = await newCompagny.save();
  var result = false;
  if (saveCompany) {
    result = true;
  }

  res.json({ result });
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
