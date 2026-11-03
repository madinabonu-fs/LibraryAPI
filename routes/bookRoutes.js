const express = require("express")
const bookRouter = express.Router()
const bookController = require("../controller/bookController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const { roleMiddleware } = require("../middlewares/roleMiddleware")


bookRouter.get("/books",  bookController.getBooks)
bookRouter.post("/books", authMiddleware, roleMiddleware("moderator","admin"), bookController.createBook)
bookRouter.get("/books/stats", authMiddleware, roleMiddleware("user","moderator","admin"), bookController.getBookStats)
bookRouter.get("/books/count", authMiddleware, roleMiddleware("user","moderator","admin"), bookController.countBooks)
bookRouter.get("/books/:id", authMiddleware, roleMiddleware("user","moderator","admin"), bookController.getBookByID)
bookRouter.put("/books/:id", authMiddleware, roleMiddleware("moderator","admin"), bookController.updateBook)
bookRouter.delete("/books/:id", authMiddleware, roleMiddleware("admin"), bookController.deleteBook)

module.exports = bookRouter
