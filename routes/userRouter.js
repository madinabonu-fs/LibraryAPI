const express = require("express")
const userRouter = express.Router()
const userController = require("../controller/userController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const { roleMiddleware } = require("../middlewares/roleMiddleware")


userRouter.get("/users", authMiddleware, roleMiddleware("admin"), userController.getUsers)
userRouter.post("/users/register", userController.registerUser)
userRouter.post("/users/login", userController.loginUser)
userRouter.get("/users/profile", authMiddleware, roleMiddleware("user","moderator","admin"), userController.profile)
userRouter.get("/users/settings", authMiddleware, roleMiddleware("user","moderator","admin"), userController.getSetting)
userRouter.post("/users/send-otp", userController.sendOTP)
userRouter.post("/users/verify-otp", userController.verifyOTP)

module.exports = userRouter
