var mongoose = require("mongoose");

var officeSchema = mongoose.Schema({
  address: String,
  city: String,
  postalCode: String,
  country: String,
  officeName: String,
  phone: String,
});

var companySchema = mongoose.Schema({
<<<<<<< HEAD
  siret: String,
  companyName: String,
  logo: String,
  type: String,
  description: String,
  shortDescription: String,
  website: String,
  companyImage: String,
  labels: [{ type: mongoose.Schema.Types.ObjectId, ref: "labels" }],
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "offers" }],
  offices: [officeSchema],
=======
    siret: String,
    companyName: String,
    logo: String,
    type: String,
    description: String,
    shortDescription: String,
    website: String,
    companyImage: String,
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: "labels" }],
    offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "offers" }],
    offices: [officeSchema],
>>>>>>> 35676adccc62939bede4d82259df6c572cc91030
});
var companyModel = mongoose.model("companies", companySchema);

module.exports = companyModel;
