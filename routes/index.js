var express = require("express");
var router = express.Router();

var uniqid = require("uniqid");
var fs = require("fs");
var cloudinary = require("cloudinary").v2;

var CompanyModel = require("../models/companies");
var OfferModel = require("../models/offers");
var UserModel = require("../models/users");
var CategoryModel = require("../models/categories");
var ConversationModel = require("../models/conversations");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

////// SEARCH //////
// route affichage catégories
router.get("/categories", function (req, res, next) {
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // FROM DB TO FRONT dans {categories} : Récupération de toutes les catégories
    res.json({ result: true, categories });
  }
});

// route affichage sub-catégories
router.get("/categories/:categorieID", function (req, res, next) {
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // FROM DB TO FRONT dans {subCategories} : Récupération des sous-catégories
    res.json({ result: true, subCategories });
  }
});

// route affichage offres selon critères recherche
router.get("/search", function (req, res, next) {
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Récupération offres selon critères recherche
    // récupère pour critères de recherche :
    // FROM FRONT : catégories / subCaterories / contenu input search / city
    // TO FRONT dans {offers} : ratings + logo entreprise (populate via companyID)
    res.json({ result: true, offers });
  }
});

// route connexion user
router.post("/image", async function (req, res, next) {
  console.log(req.files);
  var imagePath = "./tmp/" + uniqid() + ".jpg";
  var resultCopy = await req.files.image.mv(imagePath);

  if (!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(imagePath); // upload + renvoie url cloudinary
    console.log(resultCloudinary);
    if (resultCloudinary.url) {
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
<<<<<<< HEAD
=======
})
//route pour ajouter à la main une company
router.get("/ajoutcompany", async function (req, res, next) {
  var newCompagny = new CompanyModel({
    siret: "9999999999",
    companyName: "CompanyTest1",
    logo: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80",
    type: "Prestataire",
    description: "Description company 1",
    shortDescription: "ShortDescription company 1",
    website: "https://www.google.fr/",
    companyImage:
      "https://images.unsplash.com/photo-1495314736024-fa5e4b37b979?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80",

    offers: [
      "61af78bc4292b4fe7bf8a1d9",
      "61af79470346488ca041da0c",
      "61af796c6f3e101baa8b7cd1",
      "61af79a9c3c2ce891515a112",
      "61af7a09cec6028d366c7cf5",
    ],
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Paris",
        postalCode: "70017",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var saveCompany = await newCompagny.save();
  var result = false;
  if (saveCompany) {
    result = true;
  }

  res.json({ result });
});


//route pour ajouter à la main une company
router.get("/seed", async function (req, res, next) {

  await OfferModel.collection.drop();
  await CompanyModel.collection.drop();
  await ConversationModel.collection.drop();
  await UserModel.collection.drop();
  
  var offercafejoyeux = new OfferModel({
    offerName: "Livraison de Café 100% Bio",
    offerImage: "https://www.lemondedesartisans.fr/sites/lemondedesartisans.fr/files/illustrations/articles/cafe-torrefacteurs.jpg",
    description: "Découvrez une famille de cafés-restaurants qui emploie et forme des personnes en situation de handicap mental et cognitif.",
    shortDescription: "Découvrez une famille de cafés-restaurants qui emploie et forme des personnes en situation de handicap mental et cognitif.",
    commitments: [{
      commitment: "Emploie et forme des personnes en situation de handicap mental et cognitif",
    }, {
      commitment: "Consacre l'intégralité de sa création de valeur à l'inclusion du handicap sous toutes ses formes",
    }],
    categoriyId: "61af71d1d5cc85a5c2ec1ac3",
    subCategoriyId: "61af71d1d5cc85a5c2ec1ac7",
    questions: [],
  });

  var offercafejoyeux = await offercafejoyeux.save();

  var cafejoyeux = new CompanyModel({
    siret: "9999999999",
    companyName: "Café Joyeux",
    logo: "http://172.17.1.123:3000/images/assets/cafejoyeux-logo.png",
    type: "partner",
    description: "Café Joyeux propose la livraison de café en grain et emploie des serveurs et cuisiniers porteurs d'un handicap mental ou cognitif.",
    shortDescription: "Café Joyeux propose la livraison de café en grain et emploie des serveurs et cuisiniers porteurs d'un handicap mental ou cognitif.",
    website: "https://cafejoyeux.fr",
    labels: [
      "61b23957f31b3b87e3859a59",
      "61b23994f31b3b87e3859a5a"
    ],
    companyImage:
      "http://172.17.1.123:3000/images/assets/cafejoyeux-image.jpg",
    offers: [
      offercafejoyeux._id
    ],
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Paris",
        postalCode: "75011",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var cafejoyeux = await cafejoyeux.save();

  var usercafejoyeux = new UserModel({
    type: "partner",
    token: "token1",
    email: "hello@cafejoyeux.fr",
    password: "$2b$10$Hqef4EmwscuEoYofp72tFeK4D6jYDWiiho70z.6Q06IPwkfMZoZRW",
    firstName: "Pierre",
    lastName: "Aubert",
    phone: "0600000000",
    role: "Ceo",
    avatar: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
    companyId: cafejoyeux._id,
    favorites: []
  });

  var usercafejoyeux = await usercafejoyeux.save();

  var offerkawa = new OfferModel({
    offerName: "Livraison de Café 100% Bio",
    offerImage: "https://www.noovomoi.ca/content/dam/style-de-vie/migrated/images/2013/09/12/pour-un-cafe-parfait-670-1.jpg",
    description: "Découvrez notre offre de livraison de café fraîchement torréfié et des solutions de machines à café automatiques afin de proposer une alternative écologique et économique aux capsules.",
    shortDescription: "Découvrez notre offre de livraison de café fraîchement torréfié et des solutions de machines à café automatiques afin de proposer une alternative écologique et économique aux capsules.",
    commitments: [{
      commitment: "Le meilleur du café de spécialité torréfié à Paris",
    }, {
      commitment: "Consacre l'intégralité de sa création de valeur à l'inclusion du handicap sous toutes ses formes",
    }],
    categoriyId: "61af71d1d5cc85a5c2ec1ac3",
    subCategoriyId: "61af71d1d5cc85a5c2ec1ac7",
    questions: [],
  });

  var offerkawa = await offerkawa.save();

  var kawa = new CompanyModel({
    siret: "9999999999",
    companyName: "Kawa",
    logo: "http://172.17.1.123:3000/images/assets/kawa-logo.png",
    type: "partner",
    description: "Kawa offre un service de livraison de café torréfié et des machines à café automatiques comme alternative écologique aux capsules.",
    shortDescription: "Kawa offre un service de livraison de café torréfié et des machines à café automatiques comme alternative écologique aux capsules.",
    website: "https://kawa.fr",
    labels: [
      "61b23957f31b3b87e3859a59",
      "61b23994f31b3b87e3859a5a"
    ],
    companyImage:
      "http://172.17.1.123:3000/images/assets/kawa-image.jpg",
    offers: [
      offerkawa._id
    ],
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Paris",
        postalCode: "75011",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var kawa = await kawa.save();

  var userkawa = new UserModel({
    type: "partner",
    token: "token1",
    email: "hello@kawa.fr",
    password: "$2b$10$Hqef4EmwscuEoYofp72tFeK4D6jYDWiiho70z.6Q06IPwkfMZoZRW",
    firstName: "Pierre",
    lastName: "Aubert",
    phone: "0600000000",
    role: "Ceo",
    avatar: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
    companyId: kawa._id,
    favorites: []
  });

  var userkawa = await userkawa.save();
  
  var offerslean = new OfferModel({
    offerName: "Mobilier éco-responsable made in France",
    offerImage: "https://cdn.shopify.com/s/files/1/0191/7701/3348/articles/hero-image-slean-9_1512x-min_2_1400x_aa4d75cd-a3e9-4605-8236-c1ef4ec13a0a_800x800.jpg?v=1630590828",
    description: "Le bureau Slean s'adapte aux plus petits espaces. Il s'installe et se démonte en 2 minutes et se transforme en deux commodes lorsque la journée se termine.",
    shortDescription: "Le bureau Slean s'adapte aux plus petits espaces. Il s'installe et se démonte en 2 minutes et se transforme en deux commodes lorsque la journée se termine.",
    commitments: [{
      commitment: "S'installe et se démonte en 2 minutes",
    }, {
      commitment: "Nous rachetons vos produits quand vous n'en avez plus besoin",
    }],
    categoriyId: "61af71d1d5cc85a5c2ec1ac3",
    subCategoriyId: "61af71d1d5cc85a5c2ec1ac8",
    questions: [],
  });

  var offerslean = await offerslean.save();

  var slean = new CompanyModel({
    siret: "9999999999",
    companyName: "Slean",
    logo: "http://172.17.1.123:3000/images/assets/slean-logo.png",
    type: "partner",
    description: "Slean propose un bureau éco-responsable idéal pour télétravailler. Il s'adapte aux petits espaces, fait en France et garanti à vie.",
    shortDescription: "Slean propose un bureau éco-responsable idéal pour télétravailler. Il s'adapte aux petits espaces, fait en France et garanti à vie.",
    website: "https://slean.fr",
    labels: [
      "61b23957f31b3b87e3859a59",
      "61b23994f31b3b87e3859a5a"
    ],
    companyImage:
      "http://172.17.1.123:3000/images/assets/slean-image.jpg",
    offers: [
      offerslean._id
    ],
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Paris",
        postalCode: "75011",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var slean = await slean.save();

  var userslean = new UserModel({
    type: "partner",
    token: "token1",
    email: "hello@slean.fr",
    password: "$2b$10$Hqef4EmwscuEoYofp72tFeK4D6jYDWiiho70z.6Q06IPwkfMZoZRW",
    firstName: "Pierre",
    lastName: "Aubert",
    phone: "0600000000",
    role: "Ceo",
    avatar: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
    companyId: slean._id,
    favorites: []
  });

  var userslean = await userslean.save();
  
  var offerbluedigo = new OfferModel({
    offerName: "Mobilier de seconde main",
    offerImage: "https://i0.wp.com/www.infoburomag.com/wp-content/uploads/2020/03/Visuel-Bluedigo-002.jpg?fit=3120%2C2080",
    description: "Découvrez nos offres de mobilier de seconde main. Préparez-vous à adorer votre bureau grâce à nos meubles de qualité.",
    shortDescription: "Découvrez nos offres de mobilier de seconde main. Préparez-vous à adorer votre bureau grâce à nos meubles de qualité.",
    commitments: [{
      commitment: "Mobilier chiné avec amour",
    }, {
      commitment: "Livraison 100% électrique",
    }],
    categoriyId: "61af71d1d5cc85a5c2ec1ac3",
    subCategoriyId: "61af71d1d5cc85a5c2ec1ac8",
    questions: [],
  });

  var offerbluedigo = await offerbluedigo.save();

  var bluedigo = new CompanyModel({
    siret: "9999999999",
    companyName: "Bluedigo",
    logo: "http://172.17.1.123:3000/images/assets/bluedigo-logo.png",
    type: "partner",
    description: "Bluedigo propose du mobilier de bureau d'occasion et éco-responsable pour donner un impact positif aux achats des entreprises.",
    shortDescription: "Bluedigo propose du mobilier de bureau d'occasion et éco-responsable pour donner un impact positif aux achats des entreprises.",
    website: "https://bluedigo.fr",
    labels: [
      "61b23957f31b3b87e3859a59",
      "61b23994f31b3b87e3859a5a"
    ],
    companyImage:
      "http://172.17.1.123:3000/images/assets/bluedigo-image.jpg",
    offers: [
      offerbluedigo._id
    ],
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Paris",
        postalCode: "75011",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var bluedigo = await bluedigo.save();

  var userbluedigo = new UserModel({
    type: "partner",
    token: "token1",
    email: "hello@bluedigo.fr",
    password: "$2b$10$Hqef4EmwscuEoYofp72tFeK4D6jYDWiiho70z.6Q06IPwkfMZoZRW",
    firstName: "Pierre",
    lastName: "Aubert",
    phone: "0600000000",
    role: "Ceo",
    avatar: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
    companyId: bluedigo._id,
    favorites: []
  });

  var userbluedigo = await userbluedigo.save();


  var offer1 = new OfferModel({
    offerName: "Nettoyage zero déchet",
    offerImage: "https://cache.magazine-avantages.fr/data/photo/w1000_ci/5l/zero-dechet-consommation-planete-green.jpg",
    description: "C'est le moment de se préparer pour un grand ménage de printemps. Mais cette année, on fait le ménage en mode naturel et zéro-déchet.",
    shortDescription: "C'est le moment de se préparer pour un grand ménage de printemps. Mais cette année, on fait le ménage en mode naturel et zéro-déchet.",
    commitments: [{
      commitment: "Zéro déchet",
    }, {
      commitment: "Produits 100% Naturel",
    }],
    categoriyId: "61af71d1d5cc85a5c2ec1ac3",
    subCategoriyId: "61af71d1d5cc85a5c2ec1ac4",
    questions: [],
  });

  var offer1 = await offer1.save();

  var offer2 = new OfferModel({
    offerName: "Ménage 100% Bio & Made in France",
    offerImage: "https://alternativi.fr/uploads/articles/179/faire-le-menage-en-mode-zero-dechet-e42.jpg",
    description: "Découvrez nos ménages 100% naturels et 100% bio. Nous sommes à votre disposition pour vous aider à organiser votre ménage.",
    shortDescription: "Découvrez nos ménages 100% naturels et 100% bio. Nous sommes à votre disposition pour vous aider à organiser votre ménage.",
    commitments: [{
      commitment: "Produits fait en Bretagne par une entreprise familliale",
    }, {
      commitment: "Toutes les déchets sont recyclés",
    }],
    categoriyId: "61af71d1d5cc85a5c2ec1ac3",
    subCategoriyId: "61af71d1d5cc85a5c2ec1ac4",
    questions: [],
  });

  var offer2 = await offer2.save();

  var offer3 = new OfferModel({
    offerName: "Équipe d'entretien à taille humaine",
    offerImage: "https://energir.com/blogue/wp-content/uploads/2017/09/bandeau-equipe-menage.jpg",
    description: "Nos équipes d'entretien sont à votre disposition pour vous aider à organiser votre ménage.",
    shortDescription: "Nos équipes d'entretien sont à votre disposition pour vous aider à organiser votre ménage.",
    commitments: [{
      commitment: "Une équipe dédiée à votre ménage",
    }, {
      commitment: "Une gamme de produit 100% naturel",
    }],
    categoriyId: "61af71d1d5cc85a5c2ec1ac3",
    subCategoriyId: "61af71d1d5cc85a5c2ec1ac4",
    questions: [],
  });

  var offer3 = await offer3.save();

  var offer4 = new OfferModel({
    offerName: "Solution de recyclage tout-en-un",
    offerImage: "https://www.ecologie.gouv.fr/sites/default/files/styles/standard/public/GESTE%20DE%20TRI.png?itok=Rfm2M9wU",
    description: "Notre solution de recyclage tout-en-un vous permet de recycler toutes vos déchets simplement et rapidement.",
    shortDescription: "Notre solution de recyclage tout-en-un vous permet de recycler toutes vos déchets simplement et rapidement.",
    commitments: [{
      commitment: "Installation rapide et facile",
    }, {
      commitment: "Nos équipes d'entretien s'occupe de tout",
    }],
    categoriyId: "61af71d1d5cc85a5c2ec1ac3",
    subCategoriyId: "61af71d1d5cc85a5c2ec1ac9",
    questions: [],
  });

  var offer4 = await offer4.save();

  var ekoklean = new CompanyModel({
    siret: "9999999999",
    companyName: "Ekoklean",
    logo: "http://172.17.1.123:3000/images/assets/ekoklean-logo.png",
    type: "partner",
    description: "Ekoklean offre un service de ménage écologique et durable pour les entreprises grâce à des produits écologiques et/ou bio-sourcés.",
    shortDescription: "Ekoklean offre un service de ménage écologique et durable pour les entreprises grâce à des produits écologiques et/ou bio-sourcés.",
    website: "https://ekoklean.fr",
    labels: [
      "61b23957f31b3b87e3859a59",
      "61b23994f31b3b87e3859a5a"
    ],
    companyImage:
      "http://172.17.1.123:3000/images/assets/ekoklean-image.jpg",
    offers: [
      offer1._id
    ],
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Paris",
        postalCode: "75011",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var ekoklean = await ekoklean.save();

  var aura = new CompanyModel({
    siret: "9999999999",
    companyName: "Aura",
    logo: "http://172.17.1.123:3000/images/assets/aura-logo.png",
    type: "partner",
    description: "Aura propose un nettoyage responsable de vos locaux avec des produits certifiés éco-label et la mise en place du tri des déchets.",
    shortDescription: "Aura propose un nettoyage responsable de vos locaux avec des produits certifiés éco-label et la mise en place du tri des déchets.",
    website: "https://www.aura-proprete.fr",
    labels: [
      "61b23957f31b3b87e3859a59",
      "61b23994f31b3b87e3859a5a"
    ],
    companyImage:
      "http://172.17.1.123:3000/images/assets/aura-image.jpg",
    offers: [
      offer2._id
    ],
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Paris",
        postalCode: "75017",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var aura = await aura.save();

  var cleany = new CompanyModel({
    siret: "9999999999",
    companyName: "Cleany",
    logo: "http://172.17.1.123:3000/images/assets/cleany-logo.png",
    type: "partner",
    description: "Cleany propose un nettoyage responsable et adapté aux enjeux de bureaux en utilisant des produits d'entretien éco-friendly.",
    shortDescription: "Cleany propose un nettoyage responsable et adapté aux enjeux de bureaux en utilisant des produits d'entretien éco-friendly.",
    website: "https://www.cleany.fr",
    labels: [
      "61b23957f31b3b87e3859a59",
      "61b23994f31b3b87e3859a5a"
    ],
    companyImage:
      "http://172.17.1.123:3000/images/assets/cleany-image.jpg",
    offers: [
      offer3._id,
      offer4._id
    ],
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Saint-Ouen",
        postalCode: "93400",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var cleany = await cleany.save();

  var user1 = new UserModel({
    type: "partner",
    token: "token1",
    email: "hello@ekoklean.fr",
    password: "$2b$10$Hqef4EmwscuEoYofp72tFeK4D6jYDWiiho70z.6Q06IPwkfMZoZRW",
    firstName: "Jean",
    lastName: "Martin",
    phone: "0600000000",
    role: "Ceo",
    avatar: "https://d25d2506sfb94s.cloudfront.net/cumulus_uploads/userprofile/1285/Patrick-cms.JPG",
    companyId: ekoklean._id,
    favorites: []
  });

  var user1 = await user1.save();

  var user2 = new UserModel({
    type: "partner",
    token: "token2",
    email: "hello@aura.fr",
    password: "$2b$10$Hqef4EmwscuEoYofp72tFeK4D6jYDWiiho70z.6Q06IPwkfMZoZRW",
    firstName: "Johanna",
    lastName: "Pereira",
    phone: "0600000000",
    role: "Commerciale",
    avatar: "https://www.missnumerique.com/blog/wp-content/uploads/reussir-sa-photo-de-profil-michael-dam.jpg",
    companyId: aura._id,
    favorites: []
  });

  var user2 = await user2.save();

  var user3 = new UserModel({
    type: "partner",
    token: "token3",
    email: "hello@cleany.fr",
    password: "$2b$10$Hqef4EmwscuEoYofp72tFeK4D6jYDWiiho70z.6Q06IPwkfMZoZRW",
    firstName: "Marine",
    lastName: "Dupont",
    phone: "0600000000",
    role: "Commerciale",
    avatar: "https://cutewallpaper.org/21/profile-pic-for-fb-female/fb-beautiful-girl-Profile-Pictures-fb-beautiful-girl-.jpg",
    companyId: cleany._id,
    favorites: []
  });

  var user3 = await user3.save();

  var capsule = new CompanyModel({
    siret: "9999999999",
    companyName: "La Capsule",
    logo: "https://media-exp1.licdn.com/dms/image/C4D0BAQEKtZRA8You7g/company-logo_200_200/0/1618176042780?e=2159024400&v=beta&t=Evy3bQAbFyncpsSfMjXUhSJFopE9P8a1J6wL1zvsJNs",
    type: "client",
    website: "https://www.lacapsule.academy",
    offices: [
      {
        address: "56 Bv Pereire",
        city: "Paris",
        postalCode: "75017",
        country: "France",
        officeName: "Main Office",
        phone: "0000000009",
      },
    ],
  });

  var capsule = await capsule.save();

  var user4 = new UserModel({
    type: "client",
    token: "token4",
    email: "hello@lacapsule.fr",
    password: "$2b$10$Hqef4EmwscuEoYofp72tFeK4D6jYDWiiho70z.6Q06IPwkfMZoZRW",
    firstName: "Antoine",
    lastName: "Dury",
    phone: "0600000000",
    role: "Teacher",
    avatar: "https://miro.medium.com/fit/c/262/262/2*VzC6KSJYEN87rYcqt7LIiA.jpeg",
    companyId: capsule._id,
    favorites: []
  });

  var user4 = await user4.save();

  var conversation1 = new ConversationModel({
    messages: [{
      message: "Bonjour, je vous contacte pour avoir plus d'information sur votre offre",
      userId: user4._id,
      dateMessageSent: "2021-12-13T12:22:29Z"
    }, {
      message: "Super",
      userId: user1._id,
      dateMessageSent: "2021-12-13T12:23:29Z"
    }, {
      message: "Notre équipe est prête à vous répondre",
      userId: user1._id,
      dateMessageSent: "2021-12-13T12:25:29Z"
    }, {
      message: "Merci !",
      userId: user4._id,
      dateMessageSent: "2021-12-13T12:45:29Z"
    }, {
      message: "Êtes-vous prêt à nous rejoindre ?",
      userId: user1._id,
      dateMessageSent: "2021-12-13T12:46:29Z"
    }, {
      message: "Je dois encore réfléchir, merci",
      userId: user4._id,
      dateMessageSent: "2021-12-13T12:53:29Z"
    }],
    senderID: capsule._id,
    receiverID: ekoklean._id,
  });

  var conversation1 = await conversation1.save();

  var conversation2 = new ConversationModel({
    messages: [{
      message: "Bonjour, je vous contacte pour avoir plus d'information sur votre offre",
      userId: user4._id,
      dateMessageSent: "2021-12-13T11:22:29Z"
    }, {
      message: "Super",
      userId: user1._id,
      dateMessageSent: "2021-12-13T11:29:29Z"
    }, {
      message: "Notre équipe est prête à vous répondre",
      userId: user1._id,
      dateMessageSent: "2021-12-13T11:40:29Z"
    }, {
      message: "Merci !",
      userId: user4._id,
      dateMessageSent: "2021-12-13T11:41:29Z"
    }, {
      message: "Êtes-vous prêt à nous rejoindre ?",
      userId: user1._id,
      dateMessageSent: "2021-12-13T11:46:29Z"
    }],
    senderID: capsule._id,
    receiverID: aura._id,
  });

  var conversation2 = await conversation2.save();

  var conversation3 = new ConversationModel({
    messages: [{
      message: "Bonjour, je vous contacte pour avoir plus d'information sur votre offre",
      userId: user4._id,
      dateMessageSent: "2021-12-13T07:12:29Z"
    }, {
      message: "Super",
      userId: user1._id,
      dateMessageSent: "2021-12-13T08:22:29Z"
    }, {
      message: "Notre équipe est prête à vous répondre",
      userId: user1._id,
      dateMessageSent: "2021-12-13T08:23:29Z"
    }, {
      message: "Merci !",
      userId: user4._id,
      dateMessageSent: "2021-12-13T08:29:29Z"
    }],
    senderID: capsule._id,
    receiverID: cleany._id,
  });

  var conversation3 = await conversation3.save();

  var conversation4 = new ConversationModel({
    messages: [{
      message: "Bonjour, je vous contacte pour avoir plus d'information sur votre offre",
      userId: user4._id,
      dateMessageSent: "2021-12-13T07:22:29Z"
    }, {
      message: "Super",
      userId: userkawa._id,
      dateMessageSent: "2021-12-13T07:25:29Z"
    }, {
      message: "Notre équipe est prête à vous répondre",
      userId: userkawa._id,
      dateMessageSent: "2021-12-13T07:26:29Z"
    }],
    senderID: capsule._id,
    receiverID: kawa._id,
  });

  var conversation4 = await conversation4.save();

  var conversation5 = new ConversationModel({
    messages: [{
      message: "Bonjour, je vous contacte pour avoir plus d'information sur votre offre",
      userId: user4._id,
      dateMessageSent: "2021-12-13T10:01:29Z"
    }, {
      message: "Super",
      userId: usercafejoyeux._id,
      dateMessageSent: "2021-12-13T10:03:29Z"
    }],
    senderID: capsule._id,
    receiverID: cafejoyeux._id,
  });

  var conversation5 = await conversation5.save();

  var usertest = new UserModel({
    type: "client",
    token: "token2",
    email: "a",
    password: "$2b$10$SsxtSvY4bB4Pvr0lb3l9LeOqF1x4QjOKA7IIpK6wfnswEkHbvaTRu",
    firstName: "Johanna",
    lastName: "Pereira",
    phone: "0600000000",
    role: "Commerciale",
    avatar: "https://www.missnumerique.com/blog/wp-content/uploads/reussir-sa-photo-de-profil-michael-dam.jpg",
    companyId: capsule._id,
    favorites: []
  });

  var usertest = await usertest.save();

  let result = true;

  res.json({ result });
});


router.post("/rechercheparlabar", async function (req, res, next) {
  var recherche = req.body.recherche;

  var rechercheOffer = await OfferModel.find({
    $or: [
      { offerName: recherche },
      { description: recherche },
      { description: shortDescription },
      { description: shortDescription },
    ],
  });
>>>>>>> 4cd10235451bb558733f8c3b849d45f206c5287c
});

module.exports = router;
