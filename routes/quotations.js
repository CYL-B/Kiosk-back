var express = require("express");
var router = express.Router();
var OfferModel = require("../models/offers");
var QuotationModel= require("../models/quotations")

router.get("/quote-request", async function (req, res, next) {
    //récupérer le token et offerId
    // let token = req.params.token;
    // if(token){} else{}

var offer = await OfferModel.findOne({id :reqOfferId})
console.log(offer)
      res.json({ result: true, offer });
    });

    router.post("/add-quotation", async function (req, res, next) {
        //récupérer le token et offerId
        // let token = req.params.token;
        // if(token){} else{}
    
    var newQuotation = new QuotationModel({
        clientId: req.body.clientId,
        providerId:req.body.providerId,
        answers:[{answer : req.body.sunshine,
        question :"Ensoleillement"}, {answer: req.body.forfait, question:"forfait"}, {answer : req.body.area, question:"superficie"}, {answer : req.body.details, question:"Autre chose à ajouter "}],
        status : "requested",
        offerId:req.body.offerId,
        quotationUrl:"",
        dateQuotationRequested: req.body.date

    })

    var quotationSaved = await newQuotation.save();
    
          res.json({ result: true, quotationSaved });
        });

    module.exports = router;