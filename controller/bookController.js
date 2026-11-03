const Book = require("../models/book")




exports.getBooks = async(req,res) => {
    try {
        const books = await Book.find().populate("user","name")
        res.json(books)
    } catch (error) {
        res.status(500).send(error)
        
    }
    
}

exports.createBook = async(req,res) => {
    try {
        
        const {title,author,pages} = req.body

        if(typeof title !== "string" || !title.trim() || typeof author !== "string" || !author.trim() || !pages) {
            return res.status(400).json({message: "All fields are required!"})
        }

        if(typeof pages !== "number"){
            return res.status(400).json({message: "Pages must be a number!"})
        }

        if(pages <= 0 || !Number.isInteger(pages)){
            return res.status(400).json({message:"Pages must be a positive number and integar!"})
        }

        if (title.trim().length < 2 || title.length > 100) {
            return res.status(400).json({ message: "Title must be between 2 and 100 characters!" });
        }

        if (author.trim().length < 3 || author.length > 50) {
            return res.status(400).json({ message: "Author name must be between 3 and 50 characters!" });
        }

        if (pages > 10000) {
            return res.status(400).json({ message: "Pages cannot exceed 10,000!" });
        }





        const newBook = await Book.create({
            title: title.trim(),
            author: author.trim(),
            pages
                
        })

        res.status(201).json("Book was created successfully!")



        
    } catch (error) {
        res.status(500).send(error)
        
    }
    
}

exports.getBookByID = async(req,res) => {
    try {
        const id = req.params.id
        const book = await Book.findById(id)

        if(!book){
            return res.status(404).json({message: "Book not found!"})
        }

        res.status(200).json(book)
    } catch (error) {
        res.status(500).send(error)

        
    }
}

exports.updateBook = async(req,res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        if(!book){
            return res.status(404).json({message:"Book not found!"})
        }

        res.status(200).send(book)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.deleteBook = async (req,res) => {
    try {
        const id = req.params.id
        const book = await Book.findByIdAndDelete(id)

        if(!book){
            return res.status(404).json({message: "Book not found!"})
        }

        res.status(200).send("Book was deleted!")
        
    } catch (error) {
        res.status(500).send(error)
        
    }
}

exports.getBookStats = async(req,res) => {
    try {
        const stats = await Book.aggregate([
            {$match: {pages: {$gt:50 }}},
            {$group: {_id: "$author",
                totalBooks: {$sum: 1},
                avgPages: {$avg: "$pages"},
                maxPages: {$max: "$pages"},
                userId: {$first: "$user"}
            }},
            {$sort: {avgPages: -1}},
            {$limit: 10}
        ])
        res.status(200).json(stats)
    } catch (error) {
        res.status(500).send(error)
    }
}


exports.countBooks = async(req,res) => {
    try {
        const booksResult = await Book.aggregate([
            {$match: {author:"Евгений Замятин"}},
            {$count: "Total books: "}
        ])
        res.status(200).send(booksResult)
    } catch (error) {
        res.status(500).send(error)
    }
}