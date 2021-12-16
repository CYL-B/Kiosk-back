var express = require("express");
var router = express.Router();

var companyModel = require("../models/companies");
var CategoryModel = require("../models/categories");
var OfferModel = require("../models/offers");
var packModel = require("../models/packs");

router.get("/getcategories", async function (req, res, next) {
  var categorieList = await CategoryModel.find();
  if (categorieList) {
    res.json({ result: true, categorieList });
  } else {
    res.json({ result: false });
  }
});

router.post("/recherchebylistID", async function (req, res, next) {
  var recherche = req.body.recherche;
  var regex = new RegExp("\\b" + recherche, "gi");

  var rechercheOffer = await OfferModel.find({
    $or: [
      { offerName: regex },
      { description: regex },
      { shortDescription: regex },
    ],
  });
  var resultats = rechercheOffer.map(({ _id }) => ({ _id }));

  if (rechercheOffer) {
    res.json({ result: true, resultats });
  } else {
    res.json({ result: false });
  }
});

//Recherche en selectionant catégorie puis subcategorie
router.post("/recherche", async function (req, res, next) {
  var listOfferId = req.body.listOfferId;
  listOfferId = JSON.parse(listOfferId);
  console.log("listOfferId", listOfferId);

  //recherche avec list de listOfferId
  offerList = await OfferModel.find({
    _id: {
      $in: listOfferId,
    },
  });

  //ajout de compagniedata a chaque offre
  for (let i = 0; i < offerList.length; i++) {
    var companyData = await companyModel.find({
      offers: offerList[i]._id,
    });
    offerList[i] = { ...offerList[i].toJSON() };
    offerList[i].companyData = companyData;
  }

  //renvoie de la liste offres + companyData
  if (offerList.length !== 0) {
    res.json({ result: true, offerList });
  } else {
    res.json({ result: false });
  }
});

// route pour chercher via la bar de recherche
router.post("/rechercheListOffer", async function (req, res, next) {
  var recherche = req.body.recherche;
  var regex = new RegExp("\\b" + recherche, "gi");
  var listOfferID;

  //recherche par categories
  var rechercheCategorie = await CategoryModel.findOne({
    categoryName: recherche,
  });

  if (rechercheCategorie) {
    listOfferID = await OfferModel.find(
      {
        categoriyId: rechercheCategorie._id,
      },
      { _id: 1 }
    );

    listOfferID = listOfferID.map((e) => e._id);
  } else {
    var rechercheSousCategorie = await CategoryModel.findOne({
      "subCategories.subCategoryName": regex,
    });

    //si le résultat de la recherche par categorie ne donne rien, on cherche dans les sous categories
    if (rechercheSousCategorie) {
      var resultmapage = rechercheSousCategorie.subCategories.find(
        (e) =>
          e.subCategoryName.toLowerCase().includes(recherche.toLowerCase()) ===
          true
      );

      console.log("resultmapage._id", resultmapage._id);
      listOfferID = await OfferModel.find(
        {
          subCategoriyId: resultmapage._id,
        },
        { _id: 1 }
      );
      listOfferID = listOfferID.map((e) => e._id);
    }

    //si résultat de la recherche par sous categorie ne donne rien, on cherche dans les offres
    else {
      listOfferID = await OfferModel.find(
        {
          $or: [
            { offerName: regex },
            { description: regex },
            { shortDescription: regex },
          ],
        },
        { _id: 1 }
      );

      listOfferID = listOfferID.map((e) => e._id);
    }
  }

  //OK fonctionne
  //recherche dans compagnie
  // var rechercherCompanies = await companyModel.find({
  //   $or: [
  //     { companyName: regex },
  //     { description: regex },
  //     { shortDescription: regex },
  //   ],
  // });
  //

  if (listOfferID) {
    res.json({ result: true, listOfferID });
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

router.get("/getPacks", async function (req, res, next) {
  var dataPack = await packModel.find();
  if (dataPack) {
    res.json({ result: true, dataPack });
  } else {
    res.json({ result: true });
  }
});

router.get("/getPacks/:packId", async function (req, res, next) {
  var packOffers = await packModel
    .findById(req.params.packId)
    .populate("offers")
    .exec();
  // console.log("packOffers", packOffers);
  if (packOffers) {
    res.json({ result: true, packOffers });
  } else {
    res.json({ result: true });
  }
});

module.exports = router;
