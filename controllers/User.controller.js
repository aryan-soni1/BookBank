const User = require("../models/Users.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Controller to handle user registration
exports.register = async (req, res) => {
    const { name, email, password, accountType } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password || !accountType) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the required fields"
        });
    }

    // Validate accountType
    const validAccountTypes = ["Reader", "Author", "Admin"];
    if (!validAccountTypes.includes(accountType)) {
        return res.status(400).json({
            success: false,
            message: "Invalid account type. Must be 'Reader', 'Author', or 'Admin'"
        });
    }

    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({
            success: false,
            message: "User already registered. Please login first"
        });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        accountType
    });

    // Respond with success message and user details
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: newUser
    });
};

// Controller to handle user login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the required fields",
        });
    }

    // Check if the user exists in the database
    let user;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found. Please register first",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error finding user",
            error: error.message,
        });
    }

    // Compare provided password with the stored hashed password
    let isMatch;
    try {
        isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error comparing passwords",
            error: error.message,
        });
    }

    // Generate a JWT token for the authenticated user
    let token;
    try {
        token = jwt.sign({ id: user._id, accountType: user.accountType }, process.env.JWT_SECRET, {
            expiresIn: "8h", // Token expires in 8 hours
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error generating token",
            error: error.message,
        });
    }

    // Set the token as an HTTP-only cookie and send the response
    return res.status(200).cookie("token", token, {
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
    }).json({
        success: true,
        message: "User logged in successfully",
        token,
    });
};

// Controller to get user details, including populated books field
exports.getUserDetails = async (req, res) => {
    console.log("Fetching user details");

    const { id } = req.user; // Extract user ID from request object
  
    try {
        // Find the user by ID and populate the 'books' field with details
        const user = await User.findById(id).populate('books'); // Populating the books array with the full book details
        console.log("User details:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
  
        res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
