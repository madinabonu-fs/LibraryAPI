const express = require("express")
const productRouter = express.Router()
const productsController = require("../controller/productsController")

productRouter.get("/products",productsController.getProducts)
productRouter.post("/products",productsController.createProduct)
productRouter.get("/products/:id",productsController.getProductByID)
productRouter.put("/products/:id",productsController.updateProduct)
productRouter.delete("/products/:id",productsController.deleteProduct)

module.exports = productRouter