var express = require("express");
var router = express.Router();
var conversationModel = require("../models/conversations");
var CompanyModel = require("../models/companies");
var UserModel = require("../models/users");

////// CHAT //////
// route affichage conversations
router.post("/new-conversation", async function (req, res, next) {
  //var conversation = await conversationModel.find({senderId : senderId, receiverId : receiverId})
  //if (conversation){res.redirect({})}
  //else{var newConversation...}
  var newConversation = new conversationModel({
    senderID: "61ae3cbd7f3164baaccf2c6a",
    receiverID: req.body.receiverID,
    messages: [{ message: "glouglou" }],
  });

  var conversationSaved = await newConversation.save();

  res.json({ result: true, conversationSaved });
});
///conversations/:userID
router.get("/", async function (req, res, next) {
  // let token = req.query.token;

  // if (!token) {
  //     res.json({ result: false });
  // } else {

  //récupérer le user
  var user = await UserModel.findById("61af372581dee32b2aedcb55");
  // console.log("user", user)
  //récupérer l'id de l'entreprise à laquelle le user appartient
  var companyId = user.companyId;
  // console.log(companyId)
  //récupérer l'entreprise à laquelle le user appartient
  var senderCompany = await CompanyModel.findById(companyId);
  // console.log(senderCompany)
  //récupérer les conversations de l'entreprise (elle correspond au sender dans la collection "conversations")
  var conversations = await conversationModel.find({ senderId: companyId });
  // console.log(conversations)

  let conversationsToDisplay = [];

  for (var i = 0; i < conversations.length; i++) {
    var receiverCompany = await CompanyModel.findById(
      conversations[i].receiverID
    );
    // console.log("id", conversations[i].receiverID)
    // console.log("receiver", receiverCompany)
    conversationsToDisplay.push({
      id: conversations[i].id,
      logo: receiverCompany.logo ? receiverCompany.logo : "",
      message: conversations[i].messages[conversations[i].messages.length - 1],
      companyName: receiverCompany.companyName,
    });
  }

  // console.log("conversations", conversationsToDisplay)
  //récupére les informations des conversations

  res.json({ conversationsToDisplay });
});

// Récupération des conversations de la compagnie :
// récupérer companyID grâce au userID
// récupérer grace au companyID :
// FROM FRONT : userID
// FROM DB TO FRONT dans {conversations} : clientID / providerID (populate) / messages
// res.json({ result: true, conversations});
// }

// route test affichage messages d'une conversation spécifique
router.get("/messages", async function (req, res, next) {
  // :conversationsID
  var conversation = await conversationModel.findById(
    "61af3a628dee7b62da8c0782"
  );
  // console.log("conversation", conversation)
  var messagesToShow = conversation.messages;
  // console.log("messagestoshow", messagesToShow)

  // var date = messagesToShow.dateMessageSent;
  // console.log("date", date)

  var messages = [];
  for (var i = 0; i < messagesToShow.length; i++) {
    var user = await UserModel.findById(messagesToShow[i].userId);
    //.log("vérif", messagesToShow)
    let userInfo = {
      _id: user.id === req.query.user.id ? 1 : 2,
      name: user.firstName,
      avatar: user.avatar,
    };
    messages.push({
      text: messagesToShow[i].message,
      id: messagesToShow[i].id,
      createdAt: messagesToShow[i].dateMessageSent,
      user: userInfo,
    });
  }
  //console.log("messages", messages)

  // message
  // _id: 1,
  // text: 'Hello developer',
  // createdAt: new Date(),
  // user: {
  //   _id: 2,
  //   name: 'React Native',
  //   avatar: 'https://placeimg.com/140/140/any',
  // },

  //console.log("messages", messages)
  //console.log("id", userId)

  // var user = await UserModel.findById(userId.id)
  // var avatar = user.avatar

  // var userID = messagesToShow.userId
  // var user = await UserModel.findById(userID)
  // var avatar = user.avatar

  //     let token = req.query.token;

  //     if (!token) {
  //       res.json({ result: false });
  //     } else {

  // Récupération des messages de la conversation (grâce au conversationID)
  // récupérer grace au conversationID :
  // FROM FRONT : conversationID
  // FROM DB TO FRONT dans {messages} : userID (populate) / messages / dateSent
  res.json({ result: true, messages });
  // }
});

// route envoi message
router.post("/messages/:conversationsID", async function (req, res, next) {
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    var conversation = conversationModel.findById(req.body.conversationsID);
    var messages = conversation.messages.push({
      userId: "61ae3cbd7f3164baaccf2c6a",
      message: req.body.message,
      date: req.body.date,
    });

    // Envoi de messages dans la conversation
    // récupérer infos :
    // FROM FRONT : conversationID
    // FROM FRONT : contenus message / userID (store) / dateMessage
    res.json({ result: true, messages });
  }
});

module.exports = router;
