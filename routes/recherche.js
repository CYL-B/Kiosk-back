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
  // recherche = recherche.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  var regex = new RegExp("\\b" + recherche, "gi");

  // var categorieData = await OfferModel.findById()
  //   .populate("categoriyId")
  //   .find({
  //     $or: [
  //       { categoryName: regex },
  //       { "subCategories.subCategoryName": regex },
  //       { offerName: regex },
  //       { description: regex },
  //       { shortDescription: regex },
  //     ],
  //   })
  //   .exec();

  //recherche par categories ou sous gaterories
  var rechercheSousCategorie = await CategoryModel.find(
    //{
    //$or: [{ categoryName: regex },
    { "subCategories.subCategoryName": regex } //],
    //}
  );

  var categorieData;
  if (rechercheSousCategorie) {
    var sousCategories = rechercheSousCategorie[0].subCategories;
    console.log("sousCategories", sousCategories);
    categorieData = sousCategories.find(
      (o) => o.subCategoryName === ((value) => regex.test(value))
    );
    console.log("obj", categorieData);
  }

  //OK fonctionne
  //recherche dans les offre
  // var rechercheOffer = await OfferModel.find({
  //   $or: [
  //     { offerName: regex },
  //     { description: regex },
  //     { shortDescription: regex },
  //   ],
  // });

  if (categorieData) {
    res.json({ result: true, categorieData });
  } else {
    res.json({ result: false });
  }
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
