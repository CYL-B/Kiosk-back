var express = require("express");
var router = express.Router();
var conversationModel = require("../models/conversations");
var CompanyModel = require("../models/companies");
var UserModel = require("../models/users");

////// CHAT //////

//route test modif conversations

// route test création conversations
router.post("/new-conversation", async function (req, res, next) {
  //avant de créer une nouvelle conversation, il faut vérifier au préalable qu'il en existe pas déjà une entre les deux interlocuteurs :
  //var conversation = await conversationModel.find({senderId : senderId: user.companyId, receiverId : id reçu depuis la page company-prestataire})

  //si une conversation existe, il faut rediriger vers la page correspondante grâce à l'id de la conversation récupéré dans le back et à renvoyer au front if (conversation){res.redirect({})}
  //sinon, on créé une nouvelle conv : else{var newConversation...}
  var newConversation = new conversationModel({
    senderID: "61ae3cbd7f3164baaccf2c6a",
    receiverID: "61ae3d26c4c0d34ec5313d34",
    messages: [
      {
        message: "hey I'm trying",
        userId: "61af372581dee32b2aedcb55",
        dateMessageSent: new Date(),
      },
    ],
  });

  var conversationSaved = await newConversation.save();

  res.json({ result: true, conversationSaved });
});
///conversations/:userID = ne pas oublier de renvoyer le userID
//route qui affiche les conversations
router.get("/", async function (req, res, next) {
  //récupérer le token depuis le front grâce au user renvoyé par le front(props.user)
  // let token = req.query.token;

  // if (!token) {
  //     res.json({ result: false });
  // } else {

  //récupérer le user grâce au user id renvoyé du front (props.user)
  var user = await UserModel.findById("61af372581dee32b2aedcb55");
  console.log("user", user);
  //récupérer l'id de l'entreprise à laquelle le user appartient
  var companyId = user.companyId;
  console.log(companyId);
  //récupérer l'entreprise à laquelle le user appartient
  var senderCompany = await CompanyModel.findById(companyId);
  console.log(senderCompany);
  //récupérer les conversations de l'entreprise (elle correspond au sender dans la collection "conversations")
  var conversations = await conversationModel.find({ senderId: companyId });
  console.log(conversations);

  //s'il existe des conversations : if (conversations), le code suivant s'exécute

  let conversationsToDisplay = [];

  for (var i = 0; i < conversations.length; i++) {
    var receiverCompany = await CompanyModel.findById(
      conversations[i].receiverID
    );
    console.log("id", conversations[i].receiverID);
    console.log("receiver", receiverCompany);
    console.log(
      "message",
      conversations[i].messages[conversations[i].messages.length - 1].message
    );
    conversationsToDisplay.push({
      id: conversations[i].id,
      logo: receiverCompany.logo ? receiverCompany.logo : "",
      message:
        conversations[i].messages[conversations[i].messages.length - 1].message,
      date: conversations[i].messages[conversations[i].messages.length - 1]
        .dateMessageSent
        ? conversations[i].messages[conversations[i].messages.length - 1]
            .dateMessageSent
        : "",
      companyName: receiverCompany.companyName,
    });
  }
  //ajout d'objets correspondant aux conversations avec toutes les informations qu'on veut afficher dans le front dans un tableau "conversations to display"

  console.log("conversations", conversationsToDisplay);

  res.json({ conversationsToDisplay });
});
// FROM DB TO FRONT dans {conversationsToDisplay} : informations à afficher dans le front

// Récupération des conversations de la compagnie :
// récupérer companyID grâce au userID
// récupérer grace au companyID :
// FROM FRONT : userID
// FROM DB TO FRONT dans {conversations} : clientID / providerID (populate) / messages
// res.json({ result: true, conversations});
// }

// route test affichage messages d'une conversation spécifique
router.get("/messages/:convId", async function (req, res, next) {
  // FROM FRONT : conversationID + token +user

  //     let token = req.query.token;

  //     if (!token) {
  //       res.json({ result: false });
  //     } else {

  // on récupère la conversation concernée grâce à son Id : ne pas oublier de renvoyer le :conversationsID depuis le front
  var conversation = await conversationModel.findById(req.params.convId);
  console.log("conversation", conversation);
  //on cherche les messages à afficher
  var messagesToShow = conversation.messages;

  //on va chercher les informations des messages à afficher dans le front
  //il faut remplacer le 2e messagesToShow.userId par req.params.user.id quand il y aura un user logged
  var messages = [];
  for (var i = 0; i < messagesToShow.length; i++) {
    var user = await UserModel.findById(messagesToShow[i].userId);

    let userInfo = {
      _id: messagesToShow.userId === messagesToShow.userId ? 1 : 2,
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
  console.log("messages", messages);

  //sort par date

  var sortedMessages = messages
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);

  // FROM DB TO FRONT dans {messages} : userID / messages / dateSent
  res.json({ result: true, sortedMessages });
  // }
});

// route envoi message dans la conversation + convId + userId
router.post("/messages", async function (req, res, next) {
  //récupérer infos from FRONT : conversationID, contenus message / user (store) / dateMessage
  // let token = req.body.token;

  // if (!token) {
  //     res.json({ result: false });
  // } else {
  console.log("fromfront", req.body);

  var conversation = await conversationModel.findOneAndUpdate(
    { _id: "61b07b73aeda7e3faed5a42a" },
    {
      $push: {
        messages: {
          message: req.body.message,
          dateMessageSent: req.body.date,
          userId: "61af372581dee32b2aedcb55",
        },
      },
    },
    { new: true }
  );

  //     date: req.body.date
  //userID : req.body.user.userID

  //comment retrouver le message créé et lui assigner la structure exacte qu'on a dans le front
  var conversationToFind = await conversationModel.findById(
    "61b07b73aeda7e3faed5a42a"
  );
  var messageToFind =
    conversationToFind.messages[conversationToFind.messages.length - 1];

  var user = await UserModel.findById("61af372581dee32b2aedcb55");
  //pour tester message sendToFront

  //il faut remplacer le 2e messageToSendToFront.userId par req.body.user.id quand il y aura un user logged
  //req.body.user.firstName
  //req.body.user.avatar
  let userInfo = {
    _id: messageToFind.userId === messageToFind.userId ? 1 : 2,
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

  res.json({ result: true, messageToSendToFront });
});

module.exports = router;
