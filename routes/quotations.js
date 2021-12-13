var express = require("express");
const companyModel = require("../models/companies");
var router = express.Router();
var OfferModel = require("../models/offers");
var QuotationModel = require("../models/quotations")

router.get("/quote-request/:token/:reqOfferId/", async function (req, res, next) {

    let token = req.params.token;
    let offerId= req.params.reqOfferId
    if (!token) { res.json({ result: false}) } else {


        var offer = await OfferModel.findOne({ _id: offerId })
        console.log("offer", offer)


        res.json({ result: true, offer });
    }
});

router.post("/add-quotation", async function (req, res, next) {
    let token = req.body.token;
if(!token){
    res.json({ result: false})
} else{
    var newQuotation = new QuotationModel({
        clientId: req.body.clientId,
        providerId: req.body.providerId,
        answers: [{
            answer: req.body.sunshine,
            question: "Ensoleillement"
        }, { answer: req.body.forfait, question: "forfait" }, { answer: req.body.area, question: "superficie" }, { answer: req.body.details, question: "Autre chose à ajouter " }],
        status: "requested",
        offerId: req.body.offerId,
        quotationUrl: "",
        dateQuotationRequested: req.body.date

    })

    var quotationSaved = await newQuotation.save();

    res.json({ result: true, quotationSaved })};
});

router.get("/find-quotation/:token/:companyId", async function (req, res, next){

    let companyId = req.params.companyId
    let token = req.params.token
    if (!token){
        res.json({ result: false})
    } else{

        
    var quotations = await QuotationModel.find({clientId : companyId})
    var quotationsToDisplay = []
    for (var i=0; i<quotations.length; i++){
        offer = await OfferModel.findById(quotations[i].offerId);
        console.log("offer", offer)
        provider = await companyModel.findById(quotations[i].providerId)
console.log("provider",provider)
        
        quotationsToDisplay.push({
            logo: provider.logo,
            name : provider.companyName,
            offer : offer.offerName,
            status : quotations[i].status

        })
    }
    console.log("quotations", quotationsToDisplay)

    res.json({ result: true, quotationsToDisplay })}
})

module.exports = router;