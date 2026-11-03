const User = require("../models/User")
const generateToken = require("../utils/generateToken")
const {registerSchema,loginSchema} = require("../validators/userValidator")
const bcrypt = require("bcrypt")
const transporter = require("../config/mail")
const otpStore = require("../utils/otpStore")



exports.getUsers = async (req,res) => {
    try {
        const users = await User.find().select("-password")
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.registerUser = async (req,res) => {
    try {
        const validation = registerSchema.safeParse(req.body)

        if(!validation.success){
            return res.status(400).json({message:validation.error})
        }

        const{name,age,email,password,role} = validation.data
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message: "User ALREADY exists!"})
        }

        const securedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            age,
            email,
            role,
            password: securedPassword
        })

        

        const userResponse = newUser.toObject()
        delete userResponse.password

        res.status(201).json({
            message: "User registered",
            user: userResponse
        })
    } catch (error){
        res.status(500).send(error)
    }
}

exports.loginUser = async (req,res) => {
    try {
        const validation = loginSchema.safeParse(req.body)

        if(!validation.success){
            return res.status(400).json({message:"Validation error!"})
        }

        const {email,password} = validation.data
        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({message: "Invalid email or password!"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password!"})
        }

        const token = generateToken(user)
        res.status(200).json({ message: "Login successful!", token })
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if(!user) return res.status(404).json({ message: "User not found!" })
        
        res.status(200).json({
            message: "Protected profile",
            user
        })
    } catch (error) {
        res.status(500).json({message: "Server error!"})
    }
}

exports.getSetting = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        
        if (!user) {
            return res.status(404).json({message: "User not found!"})
        }

        res.status(200).json({
            message: `Welcome ${user.name}! Your age is: ${user.age}, your email is: ${user.email}`
        })
    } catch (error) {
        res.status(500).json({ message: "Server error!" })
    }
}


exports.sendOTP = async (req,res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                message: "Email required"
            })
        }

        
        const otp = Math.floor(100000 + Math.random() * 900000)

        
        otpStore[email] = otp

        
        await transporter.sendMail({
            from: "missmadinabonuu@gmail.com",
            to: email,
            subject: "OTP Code Verification",
            text: `Your OTP code is ${otp}. It is valid for a short period.`
        })

        res.status(200).json({
            message: "OTP sent successfully!",
            otp 
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.verifyOTP = (req, res) => {
    try {
        const { email, otp } = req.body
        
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP required"
            })
        }

        
        if (otpStore[email] && otpStore[email].toString() === otp.toString()) {
            
            delete otpStore[email]
            
            return res.status(200).json({
                message: "OTP verified successfully!"
            })
        }

        res.status(400).json({
            message: "Invalid or expired OTP"
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error during verification"
        })
    }
}


