var express = require("express");
var router = express.Router();

var OfferModel = require('../models/offers');
var CompanyModel = require('../models/companies');

////// OFFERS //////
// route affichage infos offres
router.get("/:offerId/:token", async function (req, res, next) {
    let token = req.params.token;

    console.log("route offers");

    if (!token) {
        res.json({ result: false });
    } else {
        var offer = await OfferModel.findById(req.params.offerId);
        console.log('offer', offer);
        var company = await CompanyModel.findOne({
            offers: offer._id,
        });
        console.log('company', company);
        // Récupération dinfos offres entreprise :
        // FROM FRONT : offerID
        // FROM DB TO FRONT dans {offers} : toutes les offres grâce au offerID (populate)
        res.json({ result: true, offer, company });
    }
});

// route envoi infos création offres
router.post("/", async function (req, res, next) {
    let token = req.body.token;

    if (!token) {
        res.json({ result: false });
    } else {
        if (!req.body.offerName) {
            res.json({ result: false, message: "offer info missing" });
        } else {
            console.log(req.body);
            let newOffer = new OfferModel({
                offerName: req.body.offerName
            });
            let offerSaved = await newOffer.save();
            res.json({ result: true, offer: offerSaved });
        }
    }
});

// route modif infos offres
router.put("/:offerId/", async function (req, res, next) {
    let token = req.body.token;

    if (!token) {
        res.json({ result: false });
    } else {
        var offer = await OfferModel.findById(req.params.offerId);
        console.log(offer);
        if (req.body.image) {
            offer.offerImage = req.body.image
        }
        if (req.body.description) {
            offer.description = req.body.description
        }
        if (req.body.commitment) {
            offer.commitments.push({ commitment: req.body.commitment });
        }
        if (req.body.commitmentId) {
            offer.commitments = offer.commitments.filter((e => e.id !== req.body.commitmentId))
        }
        await offer.save();
        var offer = await OfferModel.findById(req.params.offerId);
        res.json({ result: true, offer });
    }
});

// route delete offres
router.delete("/:offerID", function (req, res, next) {
    let token = req.query.token;

    if (!token) {
        res.json({ result: false });
    } else {
        // Suppression d'une offre
        res.json({ result: true });
    }
});

module.exports = router;