const Product = require("../models/Products")

exports.getProducts = async(req,res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).send(error)
        
    }
    
}

exports.createProduct = async(req,res) => {
    try {
        const { title, description, price } = req.body
        if(typeof title !== "string" || !title.trim() || 
            typeof description !== "string" || !description.trim() || 
            price === undefined || price === null){
            return res.status(400).json({message: "All fields (title, description, price) are required!"})
        }

        if(typeof price !== "number"){
            return res.status(400).json({message: "Price must be a number"})
        }

        if(price <= 0){
            return res.status(400).json({message: "Price must be a positive number!"})
        }

        if(price > 10000000){
            return res.status(400).json({message: "Price can't exceed 10 million."})
        }

        if(title.trim().length < 3 || title.trim().length > 150){
            return res.status(400).json({message: "Title must be between 3 and 150 characters!"})
        }

        if(description.trim().length < 10 || description.trim().length > 2000){
            return res.status(400).json({message: "Description must be between 10 and 2000 characters!"})
        }

        const newProduct = await Product.create({
            title: title.trim(),
            description: description.trim(),
            price
        })


        
        res.status(201).json("Product was created successfully!")

        
    } catch (error) {
        res.status(500).send(error)
        
    }
    
}

exports.getProductByID = async(req,res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({message: "Product not found!"})
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(500).send(error)

        
    }
}

exports.updateProduct = async(req,res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        if(!product){
            return res.status(404).json({message:"Product not found!"})
        }

        res.status(200).send(product)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.deleteProduct = async (req,res) => {
    try {
        const id = req.params.id
        const product = await Product.findByIdAndDelete(id)

        if(!product){
            return res.status(404).json({message: "Product not found!"})
        }

        res.status(200).send("Product was deleted!")
        
    } catch (error) {
        res.status(500).send(error)
        
    }
}
