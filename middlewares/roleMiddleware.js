

exports.roleMiddleware = (...roles) => {
    return(req,res,next) => {
        if(!req.user || !req.user.role){
            return res.status(400).json({message: "Role required!"})
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Access denied!"})
        }
        next()
    }
}