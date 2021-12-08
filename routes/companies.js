var express = require("express");
var router = express.Router();

var CompanyModel = require("../models/companies");
var labelModel = require("../models/labels");

////// PAGE ENTREPRISE //////
// route affichage infos inscription entreprise
router.get("/:companyId/:token", async function (req, res, next) {
  // /route/params?query
  let token = req.params.token;
  // console.log("companyiD", req.params.token, req.params.companyId);
  if (!token) {
    res.json({ result: false });
  } else {
    var company = await CompanyModel.findById(req.params.companyId);
    // Récupération dinfos inscription entreprise :
    // FROM FRONT : companyID
    // FROM DB TO FRONT dans {company} : ttes infos collection Companies (polulate offers + labels)
    res.json({ result: true, company });
  }
<<<<<<< HEAD
=======
var CompanyModel = require('../models/companies');
var labelModel = require('../models/labels');

////// PAGE ENTREPRISE //////
// route affichage infos inscription entreprise
router.get('/:companyId/:token', async function (req, res, next) { // /route/params?query
    let token = req.params.token;
// console.log("companyiD", req.params.token, req.params.companyId);
    if (!token) {
        res.json({ result: false });
    } else {
        var company = await CompanyModel.findById(req.params.companyId).populate("labels");
console.log("company", company.labels);
console.log("company", company);
        res.json({ result: true, company });
    }
>>>>>>> 323c19e0a6d6e1d425f9f67aef3bf7c07350ae60
=======
>>>>>>> recherche
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
      console.log(req.body);
      let newCompany = new CompanyModel({
        companyName: req.body.companyName,
        address: req.body.address ? req.body.address : "",
        siret: req.body.siret ? req.body.siret : "",
      });
      let companySaved = await newCompany.save();
      res.json({ result: true, company: companySaved });
    } else {
      let company = await CompanyModel.findOne({
        companyName: req.body.companyName,
      });
      if (!company) {
        console.log(req.body);
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
}
});

// route rajout infos page entreprise
router.put("/:companyId", async function (req, res, next) {
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    var dataCie = await CompanyModel.findOne({ _id: req.params.companyId });
    // console.log("dataCie", dataCie);
    const update = { description: req.body.description };
    // console.log("update", update);
    await dataCie.updateOne(update);
    // var newDescCie = await CompanyModel.updateOne(
    //       { _id: req.params.companyId },
    //       { description: req.body.description }
    // ); // update DB avec données du front/user
    // console.log("update", req.params, req.body);
    // Modif des infos création page entreprise
    // infos modifiables depuis front :
    // FROM FRONT : companyID
    // FROM FRONT : image / description (main avec affichage en mode short) / labelID / offerID
    res.json({ result: true });
  }
});

// route affichage labels
router.get("/labels", async function (req, res, next) {
  // /route/params?query

  var dataLabels = await labelModel.find();
  console.log("dataLabels", dataLabels);
  res.json({ result: true, dataLabels });
});
<<<<<<< HEAD
=======
// route rajout infos page entreprise 
router.put('/:companyId', async function (req, res, next) {
    let token = req.body.token;

    if (!token) {
        res.json({ result: false });
    } else {
        var dataCie = await CompanyModel.findOne({_id: req.params.companyId}).populate("labels"); // recupération data company de DB par ID
// console.log("dataCie", dataCie)
        if (req.body.labelId) {
            dataCie.labels.push(req.body.labelId)
        }

        if (req.body.description) {
            dataCie.description = req.body.description
        }
// console.log("dataCie", dataCie)
        await dataCie.save();
        var dataCieFull = await CompanyModel.findOne({_id: req.params.companyId}).populate("labels");
console.log("dataCieFull", dataCieFull)
// console.log("dataCie", dataCie);

        // const update = { description: req.body.description };
// console.log("update", update);
        // await dataCie.updateOne(update); // update propriété description dans DB
        // var newDescCie = await CompanyModel.updateOne(
        //       { _id: req.params.companyId },
        //       { description: req.body.description }
        // ); // update DB avec données du front/user
// console.log("update", req.params, req.body);
        // Modif des infos création page entreprise
        // infos modifiables depuis front :
        // FROM FRONT : companyID
        // FROM FRONT : image / description (main avec affichage en mode short) / labelID / offerID
        res.json({ result: true, dataCieFull });
    }
});

// route affichage labels sur page company blank + filled
router.get('/labels', async function (req, res, next) { // /route/params?query
    var dataLabels = await labelModel.find();
console.log("dataLabels", dataLabels);
    res.json({ result: true, dataLabels });
    }
);
>>>>>>> 323c19e0a6d6e1d425f9f67aef3bf7c07350ae60
=======
>>>>>>> recherche


module.exports = router;
