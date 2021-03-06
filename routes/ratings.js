var express = require("express");
var router = express.Router();

var ratingModel = require('../models/ratings');


// route get pour récupérer les notes d'une entreprise ainsi que les infos des personnes qui ont laissé des notes :
router.get('/:companyId/:token', async function (req, res, next) { 
    let token = req.params.token;
    if (!token) {
        res.json({ result: false });
    } else {
        var ratings = await ratingModel.find().populate("userId").populate("clientId").exec();

        var avg = await ratingModel.aggregate([{$group: {
            _id : "$providerId",
            averageNoteByCie: { $avg: "$rating" } // note moyenne
        }}]);
    res.json({ result: true, ratings, avg });
    }
});

// route pour créer un nouveau rating :
router.post("/:token", async function (req, res, next) {
    let token = req.params.token;
    if (!token) {
        res.json({ result: false });
    } else {
        let newRating = new ratingModel({
            feedback: req.body.feedback,
            rating: req.body.rating,
            dateRating: req.body.dateRating,
            clientId: req.body.clientId,
            providerId: req.body.providerId,
            userId: req.body.userId
    })
    let newRatingSaved = await newRating.save();
;
    res.json({ result: true, newRatingSaved });
    }
});

module.exports = router;