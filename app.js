require('dotenv').config()
const cors = require("cors")
const express = require("express")
const connectDB = require("./config/db")
const bookRouter = require("./routes/bookRoutes")
const userRouter = require("./routes/userRouter")
const productRouter = require("./routes/productRoutes")






const app = express()

app.use(express.json())
app.use(cors({origin:["http://localhost:5173/"]}))
connectDB()
app.use("/api", bookRouter)
app.use("/api", userRouter)
app.use("/api",productRouter)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server on port ${PORT} is working!`)
})