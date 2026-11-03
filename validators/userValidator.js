const { z } = require("zod")

const registerSchema = z.object({
    name: z.string({required_error: "Name is required" }).trim().min(2, "Name is too short"),
           
    age: z.number({required_error: "Age is required" }).int("Age must be an integer").min(6, "Minimum age is 6 years").max(120, "Maximum age is 120 years"),
          
    email: z.string({required_error: "Email is required" }).trim().toLowerCase().email("Invalid email format"),
            
    password: z.string({required_error: "Password is required" }).min(6,"Password must be at least 6 characters long"),

    role: z.enum(["user","moderator","admin"],{required_error: "Role is required! Must be 'user', 'moderator' or 'admin'"})
}).strict()

const loginSchema = z.object({
    email: z.string({required_error: "Email is required" }).trim().toLowerCase().email("Invalid email format"),
            
    password: z.string({required_error: "Password is required" })
}).strict()


module.exports = { registerSchema, loginSchema }
