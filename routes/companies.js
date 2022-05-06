var express = require("express");
var router = express.Router();

var CompanyModel = require("../models/companies");
var labelModel = require("../models/labels");
var OfferModel = require("../models/offers");
var UserModel = require("../models/users");
var RatingModel = require("../models/ratings");

var uniqid = require("uniqid");
var fs = require("fs");

var cloudinary = require("cloudinary").v2;

////// PAGE PROFIL ENTREPRISE //////

//route pour récupérer les informations du profil
router.get("/profile/:token/:companyId", async function (req, res, next) {
//récupère token et companyId du front, dans l'ordre
  var token = req.params.token
  var companyId = req.params.companyId

  if (!token) {
    res.json({ result: false });
  } else {


    var company = await CompanyModel.findById(companyId)

//information à renvoyer au front pour qu'elles soient affichées automatiquement dans les input
    var siret = company.siret
    var companyName = company.companyName
    var logo = company.logo


    res.json({ result: true, siret, companyName, logo });
  }

})

//route pour ajouter un logo 
router.post("/logo", async function (req, res, next) {

  console.log(req.files);
  var imagePath = "./tmp/" + uniqid() + ".jpg";
  var resultCopy = await req.files.logo.mv(imagePath);
//récupère le fichier photo envoyé du front et le stocke au format jpg

  if (!resultCopy) {
    //upload dans cloudinary
    var resultCloudinary = await cloudinary.uploader.upload(imagePath);
    console.log(resultCloudinary);
    if (resultCloudinary.url) {
      //si ça a bien été uploadé, suppression du fichier photo
      fs.unlinkSync(imagePath);
      res.json({
        result: true,
        message: "image uploaded",
        url: resultCloudinary.url,
      });
    }
  } else {
    res.json({ result: false, message: resultCopy });
  }


  res.json({ result: true})
})

//route pour modifier les informations du profil
router.put("/update-company", async function (req, res, next) {

  var token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {

    var newSiret = req.body.siret

    //cherche par id et modifie les informations de la company correspondante dans la collection companies en base de données.
    
    var updateCompany = await CompanyModel.findOneAndUpdate({_id: req.body.companyId }, {
      $set:{
      siret: newSiret,
      companyName: req.body.companyName,
      logo: req.body.logo,
      }
    }

    );
    console.log("update",updateCompany)

    if (updateCompany) {
     
      res.json({ result: true, updateCompany });
    } else {
      res.json({ result: false });
    }
  }
})

////// PAGE ENTREPRISE //////

// route affichage de toutes les entreprises (pour générer en random)
router.get("/all/:token", async function (req, res, next) {
  
  let token = req.params.token;

  if (!token) {
    res.json({ result: false });
  } else {
    var companies = await CompanyModel.find({ type: "partner" }, { _id: 1 });
    var companies = companies.map(company => company._id);

    res.json({ result: true, companies });
  }
});

// route affichage infos inscription entreprise
router.get("/:companyId/:token", async function (req, res, next) {

  let token = req.params.token;

  if (!token) {
    res.json({ result: false });
  } else {
    var company = await CompanyModel.findById(req.params.companyId)
      .populate("labels")
      .populate("offers")
      .exec();

    var ratings = await RatingModel.find({ providerId: req.params.companyId })
      .populate("clientId")
      .exec();

    res.json({ result: true, company, ratings });
  }
});

// route envoi infos inscription entreprise
router.post("/", async function (req, res, next) {
  if (!req.body.companyName) {
    res.json({ result: false, message: "company info missing" });
  } else {
    let company = await CompanyModel.findOne({
      companyName: req.body.companyName,
    });
    if (!company) {

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
});

// route rajout infos + labels page entreprise
router.put("/:companyId", async function (req, res, next) {

  let token = req.body.token;
  if (!token) {
    res.json({ result: false });
  } else {
    var dataCie = await CompanyModel.findOne({ _id: req.params.companyId }); // recupération data company de DB par ID

    if (req.body.labelId) {
      const labelFound = dataCie.labels.filter(
        (label) => label._id == req.body.labelId
      ); // on check si le label a deja ete ajouté en comparant le label récupéré du front et les labels récupérés en base de données dans le doc company
      labelFound.length === 0 && dataCie.labels.push(req.body.labelId); // si il n'a pas été trouvé, on l'ajoute
    }

    if (req.body.description) {
      dataCie.description = req.body.description;
      dataCie.shortDescription = req.body.description;
    }

    let offerSaved;
    if (req.body.offerName) {
      let newOffer = new OfferModel({
        // création nouvelle offre
        offerName: req.body.offerName,
      });
      offerSaved = await newOffer.save();
      dataCie.offers.push(offerSaved._id); // on push la nouvelle offre via son id dans la cie
    }

    if (req.body.image) {
      dataCie.companyImage = req.body.image;
    }


//les deux populates permettent de trouver les labels et l'ensemble des offres associés à l'entreprise pour les renvoyer au front
    await dataCie.save();
    var dataCieFull = await CompanyModel.findOne({ _id: req.params.companyId })
      .populate("labels")
      .populate("offers")
      .exec();

    res.json({ result: true, dataCieFull, offerSaved });
  }
});

// route affichage labels sur page company blank
router.get("/labels", async function (req, res, next) {
  var dataLabels = await labelModel.find();

  res.json({ result: true, dataLabels });
});

// route suppression labels sur page company filled
router.put("/labels/:companyId/:labelId", async function (req, res, next) {
  //on trouve la company et on retire ses labels
  await CompanyModel.updateOne(
    { _id: req.params.companyId },
    { $pull: { labels: req.params.labelId } }
  );
  var dataLabelsCieUpdated = await CompanyModel.findOne({
    _id: req.params.companyId,
  })
    .populate("labels")
    .populate("offers")
    .exec();
  res.json({ result: true, dataLabelsCieUpdated });
});

// route to like a company et l'ajouter au user
router.post("/like", async function (req, res, next) {
  let token = req.body.token;
  if (!token) {
    res.json({ result: false });
  } else {
    var user = await UserModel.findById(req.body.userId);
    if (req.body.companyId) {
      //mécanique de dislike et de like
      if (user.favorites.some(e => e.companyId && e.companyId == req.body.companyId))/*si l'entreprise est déjà dans les favoris et qu'il y a un click sur le coeur */{
        user.favorites = user.favorites.filter(e => e.offerId || (e.companyId && e.companyId != req.body.companyId));
        //filtre l'entreprise présente dans les favoris dont l'id correspond à l'id récupéré du front afin de la retirer des favoris
      } else {
        user.favorites.push({ companyId: req.body.companyId });
      }
    }
    await user.save();
    user = await UserModel.findById(req.body.userId);
    res.json({ result: true, user });
  }
});



module.exports = router;
