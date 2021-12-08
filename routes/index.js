var express = require("express");
var router = express.Router();

var companyModel = require("../models/companies");
var CategoryModel = require("../models/categories");
var OfferModel = require("../models/offers");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

////// OFFERS //////
// route affichage infos offres
router.get("/offers/:companyID", function (req, res, next) {
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Récupération dinfos offres entreprise :
    // FROM FRONT : companyID
    // FROM DB TO FRONT dans {offers} : toutes les offres grâce au companyID (populate)
    res.json({ result: true, offers });
  }
});

// route envoi infos création offres
router.post("/offers/:companyID", function (req, res, next) {
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Envoi des infos création offre :
    // FROM FRONT : companyID
    // FROM FRONT : nom offre
    res.json({ result: true });
  }
});

// route modif infos offres
router.put("/offers/:offerID", function (req, res, next) {
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Modif des infos création offre :

    res.json({ result: true });
  }
});

// route delete offres
router.delete("/offers/:offerID", function (req, res, next) {
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Suppression d'une offre
    res.json({ result: true });
  }
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
    var companyData = await companyModel.find({
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

router.get("/getcompanydata", async function (req, res, next) {
  let companyDat = await companyModel.find({
    offers: "61af78bc4292b4fe7bf8a1d9",
  });

  if (companyDat) {
    res.json({ result: true, companyDat });
  } else {
    res.json({ result: false });
  }
});

module.exports = router;
