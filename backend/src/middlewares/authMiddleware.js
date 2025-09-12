const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyToken = async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            
            const user = await User.findById(decode.id).select("id role email");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user; 
            console.log("Authenticated user:", req.user);

            next();
        } catch (error) {
            res.status(400).json({ message: "Token is not valid" });
        }
    } else {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
};

module.exports = { verifyToken };