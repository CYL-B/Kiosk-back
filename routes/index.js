var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
