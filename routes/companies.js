var express = require("express");
var router = express.Router();

var CompanyModel = require('../models/companies');
var labelModel = require('../models/labels');
var OfferModel = require('../models/offers');


////// PAGE ENTREPRISE //////
// route affichage infos inscription entreprise
router.get('/:companyId/:token', async function (req, res, next) { // /route/params?query
  let token = req.params.token;
  // console.log("companyiD", req.params.token, req.params.companyId);
  if (!token) {
    res.json({ result: false });
  } else {
    var company = await CompanyModel.findById(req.params.companyId).populate("labels").populate("offers").exec();
    // console.log("company", company.labels);
    // console.log("company", company);
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
})

// route affichage labels
router.get("/labels", async function (req, res, next) {
  // /route/params?query

  var dataLabels = await labelModel.find();
  //console.log("dataLabels", dataLabels);
  res.json({ result: true, dataLabels });
});

// route rajout infos + labels page entreprise 
router.put('/:companyId', async function (req, res, next) {
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    var dataCie = await CompanyModel.findOne({ _id: req.params.companyId }); // recupération data company de DB par ID
    // console.log("dataCie", dataCie)
    if (req.body.labelId) { //////////////
      const labelFound = dataCie.labels.filter(label => label._id == req.body.labelId) // on check si le label a deja ete ajouté
      labelFound.length === 0 && dataCie.labels.push(req.body.labelId) // si il n'a pas été trouvé, on l'ajoute
    }

    if (req.body.description) {
      dataCie.description = req.body.description;
      dataCie.shortDescription = req.body.description
    }

    let offerSaved;
    if (req.body.offerName) {
      let newOffer = new OfferModel({ // vréation nouvelle offre
        offerName: req.body.offerName
      });
      offerSaved = await newOffer.save();
      dataCie.offers.push(offerSaved._id) // on push la nouvelle offre via son id dans la cie
    }

    if (req.body.image) {
      dataCie.companyImage = req.body.image
    }
    // console.log("dataCie", dataCie)
    await dataCie.save();
    var dataCieFull = await CompanyModel.findOne({ _id: req.params.companyId }).populate("labels").populate("offers").exec();
    // console.log("dataCieFull", dataCieFull)
    // console.log("dataCie", dataCie);
    res.json({ result: true, dataCieFull, offerSaved});
  }
});

// route affichage labels sur page company blank
router.get('/labels', async function (req, res, next) { // /route/params?query
  var dataLabels = await labelModel.find();
  // console.log("dataLabels", dataLabels);
  res.json({ result: true, dataLabels });
}
);

// route suppression labels sur page company filled
router.put('/labels/:companyId/:labelId', async function (req, res, next) { // /route/params?query
  await CompanyModel.updateOne({ _id: req.params.companyId }, { $pull: { labels: req.params.labelId } })
  var dataLabelsCieUpdated = await CompanyModel.findOne({ _id: req.params.companyId }).populate("labels").populate("offers").exec();
  res.json({ result: true, dataLabelsCieUpdated });
}
);

module.exports = router;
