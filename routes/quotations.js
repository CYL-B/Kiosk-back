var express = require("express");
var router = express.Router();
var OfferModel = require("../models/offers");
var QuotationModel= require("../models/quotations")

router.get("/quote-request", async function (req, res, next) {
    //récupérer le token et offerId
    // let token = req.params.token;
    // if(token){} else{}

var offer = await OfferModel.findOne({_id :"61af78bc4292b4fe7bf8a1d9"})

      res.json({ result: true, offer });
    });

    router.post("/add-quotation", async function (req, res, next) {
        //récupérer le token et offerId
        // let token = req.params.token;
        // if(token){} else{}
    
    var newQuotation = new QuotationModel({
        clientId: "",
        providerId:"",
        answers:[{}],
        status : "requested",
        offerId:"",
        quotationUrl:"",
        dateQuotationSent: new Date(),
        dateQuotationPaid: new Date(),
        dateQuotationAccepted: new Date(),
        dateQuotationRequested: new Date(),
        dateDone:new Date()

    })

    var quotationSaved = await newQuotation.save();
    
          res.json({ result: true, quotationSaved });
        });

    module.exports = router;