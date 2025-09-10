const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register controller
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //if username or password is not provided
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        //check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered" });
        }


        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //creating new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        //save new user to DB
        await newUser.save();

        res.status(201).json({ message: `User registered with username ${username} successfully` });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) { // duplicate key error safeguard
            return res.status(400).json({ message: "Email or Username already exists" });
        }
        console.error("Error in register controller:", err);
        res.status(500).json({ message: "Something went wrong" });
    }

}

//login controller
const login = async (req, res) => {
    try {

        const { username, password } = req.body;

        //if username or password is not provided
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }


        //find user in db
        const user = await User.findOne({ username });

        //if user does not exist
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        //if user exists, compare password
        const isMatch = await bcrypt.compare(password, user.password);

        //if password does not match
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //genrate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
        )

        res.status(200).json({ message: `User ${username} logged in successfully`, token });

    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log("Error is login controller in authController.js", err);
    }
}

module.exports = { register, login };