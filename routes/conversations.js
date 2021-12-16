var express = require("express");
var router = express.Router();
var conversationModel = require("../models/conversations");
var CompanyModel = require("../models/companies");
var UserModel = require("../models/users");

////// ROUTES MESSAGES SCREEN //////

router.post("/new", async function (req, res, next) {
  //avant de créer une nouvelle conversation, il faut vérifier au préalable qu'il en existe pas déjà une entre les deux interlocuteurs :

  //si une conversation existe, il faut rediriger vers la page correspondante grâce à l'id de la conversation récupéré dans le back et à renvoyer au front if (conversation){res.redirect({})}
  //sinon, on créé une nouvelle conv

  var conversation = await conversationModel.findOne({
    senderID: req.body.senderId,
    receiverID: req.body.receiverId,
  });

  if (!conversation) {
    conversation = new conversationModel({
      senderID: req.body.senderId,
      receiverID: req.body.receiverId,
    });
    conversation = await conversation.save();
  }

  res.json({ result: true, conversation });
});


//route qui affiche les conversations

router.get("/:companyId/:userType/:token", async function (req, res, next) {
  
  let token = req.params.token;

  if (!token) {
      res.json({ result: false });
  } else {

  const dateFormat = function (date) {
    var newDate = new Date(date);
    var format =
      newDate.getDate() +
      "/" +
      (newDate.getMonth() + 1) +
      "/" +
      newDate.getFullYear();
    return format;
  };
  //récupérer l'id de l'entreprise à laquelle le user appartient
  var companyId = req.params.companyId;
  //récupérer l'entreprise à laquelle le user appartient
  var senderCompany = await CompanyModel.findById(companyId);
  //récupérer les conversations de l'entreprise (elle correspond au sender dans la collection "conversations")
  var conversations;
  if (req.params.userType == "client") {
    conversations = await conversationModel.find({ senderID: companyId });
  } else {
    conversations = await conversationModel.find({ receiverID: companyId });
  }

  let conversationsToDisplay = [];

  for (var i = 0; i < conversations.length; i++) {
    var company;
    if (req.params.userType == "client") {
      company = await CompanyModel.findById(conversations[i].receiverID);
    } else {
      company = await CompanyModel.findById(conversations[i].senderID);
    }
    conversationsToDisplay.push({
      id: conversations[i].id,
      logo: company.logo ? company.logo : "",
      message:
        conversations[i].messages[conversations[i].messages.length - 1].message,
      date: conversations[i].messages[conversations[i].messages.length - 1]
        .dateMessageSent
        ? dateFormat(
            conversations[i].messages[conversations[i].messages.length - 1]
              .dateMessageSent
          )
        : "",
      companyName: company.companyName,
    });
  }
  //ajout d'objets correspondant aux conversations avec toutes les informations qu'on veut afficher dans le front dans un tableau "conversations to display"

  res.json({ conversationsToDisplay });}
});

////// ROUTES CHAT SCREEN //////

// route affichage messages d'une conversation spécifique
router.get("/messages/:convId/:userId/:token", async function (req, res, next) {
    let token = req.params.token;

      if (!token) {
        res.json({ result: false });
      } else {

  // on récupère la conversation concernée grâce à son Id : ne pas oublier de renvoyer le :conversationsID depuis le front

  var conversation = await conversationModel.findById(req.params.convId);

  //on cherche les messages à afficher
  var messagesToShow = conversation.messages;

  //on va chercher les informations des messages à afficher dans le front
  
  var messages = [];
  for (var i = 0; i < messagesToShow.length; i++) {
    var user = await UserModel.findById(messagesToShow[i].userId);

    let userInfo = {
      _id:
        messagesToShow[i].userId == req.params.userId
          ? 1
          : messagesToShow[i].userId,
      name: user.firstName,
      avatar: user.avatar,
    };
    messages.push({
      text: messagesToShow[i].message,
      _id: messagesToShow[i].id,
      createdAt: messagesToShow[i].dateMessageSent,
      user: userInfo,
    });
  }

  //ranger les messages en affichant le plus récent en bas de la page

  var sortedMessages = messages
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);

 
  res.json({ result: true, sortedMessages })};
  
});

// route envoi message dans la conversation + convId + userId
router.post("/messages", async function (req, res, next) {
  
  let token = req.body.token;

  if (!token) {
      res.json({ result: false });
  } else {

  var conversation = await conversationModel.findOneAndUpdate(
    { _id: req.body.convId },
    {
      $push: {
        messages: {
          message: req.body.message,
          dateMessageSent: req.body.date,
          userId: req.body.userId,
        },
      },
    },
    { new: true }
  );


  //comment retrouver le message créé et lui assigner la structure exacte qu'on a dans le front
  var conversationToFind = await conversationModel.findById(req.body.convId);
  var messageToFind =
    conversationToFind.messages[conversationToFind.messages.length - 1];

  var user = await UserModel.findById(req.body.userId);
 
  let userInfo = {
    _id: 1,
    name: user.firstName,
    avatar: user.avatar,
  };
  var messageToSendToFront = {
    _id: messageToFind.id,
    text: messageToFind.message,
    createdAt: messageToFind.dateMessageSent,
    user: userInfo,
  };

  //messageToSendToFront permet de reconstituer le message enregistré dans la database pour que la structure corresponde à ce qui existe dans le front

  res.json({ result: true, messageToSendToFront })};
});

module.exports = router;



// route test création conversations
// router.post("/new-conversation", async function (req, res, next) {
 
//   var newConversation = new conversationModel({
//     senderID: "61ae3cbd7f3164baaccf2c6a",
//     receiverID: "61ae3d26c4c0d34ec5313d34",
//     messages: [
//       {
//         message: "hey I'm trying",
//         userId: "61af372581dee32b2aedcb55",
//         dateMessageSent: new Date(),
//       },
//     ],
//   });

//   var conversationSaved = await newConversation.save();

//   res.json({ result: true, conversationSaved });
// });