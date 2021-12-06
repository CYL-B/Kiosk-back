var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

////// CHAT //////
// route affichage conversations
router.get('/conversations/:userID', function(req, res, next){
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Récupération des conversations de la compagnie :
    // récupérer companyID grâce au userID
    // récupérer grace au companyID :
    // FROM FRONT : userID
    // FROM DB TO FRONT dans {conversations} : clientID / providerID (populate) / messages
    res.json({ result: true, conversations});
  }
});

// route affichage messages d'une conversation spécifique
router.get('/conversations/messages/:conversationsID', function(req, res, next){
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Récupération des messages de la conversation (grâce au conversationID)
    // récupérer grace au conversationID :
    // FROM FRONT : conversationID
    // FROM DB TO FRONT dans {messages} : userID (populate) / messages / dateSent
    res.json({ result: true, messages}); 
  }
});

// route envoi message
router.post('/conversations/messages/:conversationsID', function(req, res,next){
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Envoi de messages dans la conversation
    // récupérer infos :
    // FROM FRONT : conversationID
    // FROM FRONT : contenus message / userID (store) / dateMessage
    res.json({ result: true });
  }
});

////// PAGE ENTREPRISE //////
// route affichage infos inscription entreprise
router.get('/companies/:companyID', function(req, res, next){
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Récupération dinfos inscription entreprise :
    // FROM FRONT : companyID
    // FROM DB TO FRONT dans {company} : ttes infos collection Companies (polulate offers + labels)
    res.json({ result: true, company}); 
  }
});

// route envoi infos inscirption entreprise 
router.post('/companies', function(req, res,next){
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Envoi du front des infos inscirption de la compagny : 
    // FROM FRONT : nom entreprise / adresse / siret / userID
    res.json({ result: true });
  }
});

// route rajout infos page entreprise 
router.put('/companies/:companyID', function(req, res,next){
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Modif des infos création page entreprise
    // infos modifiables depuis front :
    // FROM FRONT : companyID
    // FROM FRONT : image / description (main avec affichage en mode short) / labelID / offerID
    res.json({ result: true });
  }
});

////// OFFERS //////
// route affichage infos offres
router.get('/offers/:companyID', function(req, res, next){
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Récupération dinfos offres entreprise :
    // FROM FRONT : companyID
    // FROM DB TO FRONT dans {offers} : toutes les offres grâce au companyID (populate)
    res.json({ result: true, offers}); 
  }
});

// route envoi infos création offres 
router.post('/offers/:companyID', function(req, res,next){
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Envoi des infos création offre :
    // FROM FRONT : companyID
    // FROM FRONT : nom offre
    res.json({ result: true });
  }
});

// route modif infos offres 
router.put('/offers/:offerID', function(req, res,next){
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Modif des infos création offre : 

    res.json({ result: true });
  }
});

// route delete offres 
router.delete('/offers/:offerID', function(req, res,next){
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Suppression d'une offre
    res.json({ result: true });
  }
});

////// SEARCH //////
// route affichage catégories 
router.get('/categories', function(req, res, next){
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // FROM DB TO FRONT dans {categories} : Récupération de toutes les catégories
    res.json({ result: true, categories}); 
  }
});

// route affichage sub-catégories 
router.get('/categories/:categorieID', function(req, res, next){
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // FROM DB TO FRONT dans {subCategories} : Récupération des sous-catégories
    res.json({ result: true, subCategories}); 
  }
});

// route affichage offres selon critères recherche
router.get('/search', function(req, res, next){
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

module.exports = router;
