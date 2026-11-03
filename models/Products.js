const mongoose = require("mongoose")

const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number

})

module.exports = mongoose.model("Product", productsSchema)