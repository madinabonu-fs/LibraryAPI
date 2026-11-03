const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Atlas connected!")
    } catch (error) {
        console.log("Database connection error!", error.message)
        process.exit(1)
    }
}

module.exports = connectDB
