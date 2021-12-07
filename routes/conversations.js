var express = require('express');
var router = express.Router();
var conversationModel = require('../models/conversations');
var CompanyModel = require('../models/companies');


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
  router.get('/:userID', async function(req, res, next){
      //récupérer les conversations du user
    var user = await userModel.findById (req.query.userId)
    var companyId = user.companyId
    var conversations = await CompanyModel.find({id : senderId}).populate('conversations')
    var conversationID = conversations.id
//récupère l'ID du destinataire
    var receiverID = conversations.receiverID
//récupète les informations du destinataire
    var receiver = await CompanyModel.find({id: receiverID}).populate('company')

    var companyName = receiver.companyName
    var logo = receiver.logo

    //récupération des messages

    var messages = conversations.messages
    var lastMessage = messages.slice(-1)
  
      res.json({ result: true});
    
  });
  
  
  router.get('/conversations/:userID', async function(req, res, next){
    
  
  
  // for (var i=0;i<conversations.length;i++){
  //   var conversationID = conversations[i].id
  // }
  


  
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
  router.get('/messages/:conversationsID', async function(req, res, next){
var conversation = await conversationModel.findById(req.query.conversationID)
var messagesToShow = conversation.messages;

var date = messagesToShow.dateMessageSent;
var message = messagesToShow.message;
var userID = messagesToShow.userId
var user = await userModel.findById(userID)
var avatar = user.avatar

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
  router.post('/messages/:conversationsID', async function(req, res,next){
    let token = req.body.token;
  
    if (!token) {
      res.json({ result: false });
    } else {
      var conversation = conversationModel.findById(req.body.conversationsID)
  var messages = conversation.messages.push({
    userId: req.body.userId,
    message : req.body.message,
    date: req.body.date
  })
  
      // Envoi de messages dans la conversation
      // récupérer infos :
      // FROM FRONT : conversationID
      // FROM FRONT : contenus message / userID (store) / dateMessage
      res.json({ result: true , messages});
    }
  });
  

module.exports = router;