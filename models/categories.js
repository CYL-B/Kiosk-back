var mongoose = require("mongoose");

var subCategorySchema = mongoose.Schema({
subCategoryName = String,
subCategoryImage = String,
})

var categorySchema = mongoose.Schema({
    categoryName = String,
    categoryImage = String,
    subCategories = [subCategorySchema]
})

var categoryModel = mongoose.model("categories", categorySchema);

module.export = categoryModel;