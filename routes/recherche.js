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

router.post("/recherchebylistID", async function (req, res, next) {
  // var listeofferID = req.body.listeofferID;

  // var listeofferID = [
  //   "61b72b8e3ef976a3b8be1b05",
  //   "61b72b8f3ef976a3b8be1b0e",
  //   "61b72b8f3ef976a3b8be1b17",
  // ];

  // var offerList = await OfferModel.find({
  //   _id: {
  //     $in: listeofferID,
  //   },
  // });

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

  // var resultats = rechercheOffer.map((e) => {
  //   return { id: e._id };
  // });

  if (rechercheOffer) {
    res.json({ result: true, resultats });
  } else {
    res.json({ result: false });
  }
});

//Recherche en selectionant catégorie puis subcategorie
router.post("/recherche", async function (req, res, next) {
  // var subcategorieId = req.body.subcategorieId;
  // var categorieId = req.body.categorieId;

  // var offerList;

  // //recherche liste offres avec subcategorieId ou categorieId, Si aucun des deux recherche offre avec listOfferId
  // if (subcategorieId === categorieId) {
  //   offerList = await OfferModel.find({ categoriyId: categorieId });
  // } else if (listOfferId) {
  //   offerList = await OfferModel.find({
  //     _id: {
  //       $in: listOfferId,
  //     },
  //   });
  // } else {
  //   offerList = await OfferModel.find({ subCategoriyId: subcategorieId });
  // }

  var listOfferId = req.body.listOfferId;
  listOfferId = JSON.parse(listOfferId);
  //console.log("listOfferId", listOfferId);

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
  if (offerList) {
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

  //recherche par souscategories ou  gaterories en commenté

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

    //console.log("rechercheSousCategorie", rechercheSousCategorie);

    //si résultat de la recherche par sous categorie
    if (rechercheSousCategorie) {
      //on extra
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

    //si pas de résultat de la recherche par sous categorie, on cherche dans offer
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

module.exports = router;
