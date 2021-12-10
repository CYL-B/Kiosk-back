var express = require("express");
var router = express.Router();

var companyModel = require("../models/companies");
var CategoryModel = require("../models/categories");
var OfferModel = require("../models/offers");

router.get("/getcategories", async function (req, res, next) {
  var categorieList = await CategoryModel.find();
  if (categorieList) {
    res.json({ result: true, categorieList });
  } else {
    res.json({ result: true });
  }
});

//Recherche en selectionant catégorie puis subcategorie
router.post("/recherche", async function (req, res, next) {
  var subcategorieId = req.body.subcategorieId;
  var categorieId = req.body.categorieId;

  console.log(subcategorieId);

  var offerList;

  if (subcategorieId === categorieId) {
    offerList = await OfferModel.find({ categoriyId: categorieId });
  } else {
    offerList = await OfferModel.find({ subCategoriyId: subcategorieId });
  }

  for (let i = 0; i < offerList.length; i++) {
    var companyData = await companyModel.find({
      offers: offerList[i]._id,
    });
    offerList[i] = { ...offerList[i].toJSON() };
    offerList[i].companyData = companyData;
  }

  if (offerList) {
    res.json({ result: true, offerList });
  } else {
    res.json({ result: false });
  }
});

// route pour chercher via la bar de recherche
router.post("/rechercheparlabar", async function (req, res, next) {
  var recherche = req.body.recherche;

  var regex = new RegExp("\\b" + recherche + "\\b", "gi");

  //recherche par categories ou sous gaterories
  //   var rechercheOfferCategorie = await CategoryModel.find({
  //     $or: [
  //       { description: regex },
  //       { "subCategories.subCategoryName": "Evenements" },
  //     ],
  //   });

  //recherche dans les offre
  var rechercheOffer = await OfferModel.find({
    $or: [
      { offerName: regex },
      { description: regex },
      { shortDescription: regex },
    ],
  });

  if (rechercheOfferCategorie) {
    res.json({ result: true, rechercheOfferCategorie });
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

router.get("/getsubcategories", async function (req, res, next) {
  var categorieList = await CategoryModel.find();

  var subcategorieList = [];
  var subcategorieListmap = categorieList.map((e, i) => {
    subcategorieList.push(e.subCategories);
  });

  if (subcategorieList.length !== 0) {
    res.json({ result: true, subcategorieList });
  } else {
    res.json({ result: true });
  }
  res.json({ result: true });
});

module.exports = router;
