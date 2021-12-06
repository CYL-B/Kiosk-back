var mongoose = require('mongoose');

var favoritesSchema = mongoose.Schema({
    companyId: String,
    offerId: String
});

var userSchema = mongoose.Schema({
    type: String,
    token: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    role: String,
    avatar: String,
    companyId: String,
    favorites: [favoritesSchema]
});
var userModel = mongoose.model('users', userSchema);

module.exports = userModel;