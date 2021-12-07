var express = require('express');
var conversationModel = require('../models/conversations');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

////// CHAT //////
// route affichage conversations
router.post ('/new-conversation', async function(req, res, next){

  var newConversation= new conversationModel ({
    senderID : "61ae3cbd7f3164baaccf2c6a",
    receiverID: "61ae3d26c4c0d34ec5313d34",
    messages:[{message:"gligli"}]
  })

  var conversationSaved = await newConversation.save()

  

  res.json({ result: true, conversationSaved});
}
);
//route de test get
router.get('/conversations', async function(req, res, next){
  var company = await companyModel.findById('61ae3d26c4c0d34ec5313d34')
  console.log(company)

    res.json({ result: true});
  
});


router.get('/conversations/:userID', async function(req, res, next){
  var company = await companyModel.findById('61ae3d26c4c0d34ec5313d34')
  console.log(company)
// var user = await userModel.findById (req.query.userId);

// var companyId = user.companyId

// var conversations = await conversationModel.find({senderID: companyId})

// for (var i=0;i<conversations.length;i++){
//   var conversationID = conversations[i].id
// }

// var conversationId = conversation.id
// var messages = conversation.messages
// var lastMessage = messages.slice(-1)

// var senderID = conversations.senderID
// var receiverID = conversations.receiverID

// var receiverCompany = await conversationModel.findById(receiverID).populate("company")

// var avatar = receiverCompany.logo;
// var companyName = receiverCompany.companyName

  // result = [{
  //   companyId: 4444,
  //   messages: []
  // },{
  //   companyId: 5555,
  //   messages: []
  // }]

  // conversations = [{
  //   companyId: 3333,
  //   logo: 'https://www.google.com/img.jpg',
  //   message: {
  //     message: "salut toi",
  //     userId: 44444,
  //     dateMessageSent: 3431
  //   }
  // },{
  //   companyId: 3333,
  //   logo: 'https://www.google.com/img.jpg',
  //   message: {
  //     message: "salut toi",
  //     userId: 44444,
  //     dateMessageSent: 3431
  //   }
  // }]
  // let token = req.query.token;

  // if (!token) {
    res.json({ result: true});
  // } else {
    // Récupération des conversations de la compagnie :
    // récupérer companyID grâce au userID
    // récupérer grace au companyID :
    // FROM FRONT : userID
    // FROM DB TO FRONT dans {conversations} : clientID / providerID (populate) / messages
    // res.json({ result: true, conversations});
  // }
});

// route affichage messages d'une conversation spécifique
router.get('/conversations/messages/:conversationsID', async function(req, res, next){
  let token = req.query.token;

  if (!token) {
    res.json({ result: false });
  } else {
    var conversation = conversationModel.findById(req.body.conversationID)
    var messages = conversation.messages
    var userID = messages[O].userId

    var user = await userModel.findById(userID)

    var avatar = user.avatar


    
    // Récupération des messages de la conversation (grâce au conversationID)
    // récupérer grace au conversationID :
    // FROM FRONT : conversationID
    // FROM DB TO FRONT dans {messages} : userID (populate) / messages / dateSent
    res.json({ result: true, messages}); 
  }
});

// route envoi message
router.post('/conversations/messages/:conversationsID', async function(req, res,next){
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    var conversation = conversationModel.findById(req.body.conversationID)
var messages = conversation.messages.push({
  userId: req.body.userId,
  message : req.body.message,
  date: date
})

    // Envoi de messages dans la conversation
    // récupérer infos :
    // FROM FRONT : conversationID
    // FROM FRONT : contenus message / userID (store) / dateMessage
    res.json({ result: true , messages});
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
