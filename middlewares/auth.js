// Import the jsonwebtoken library for handling JWTs
const jwt = require("jsonwebtoken");
// Import the dotenv library to access environment variables
require("dotenv").config();

// Middleware function to authenticate users based on JWT
exports.auth = async (req, res, next) => {
  console.log("cookies are", req.cookies); // Log cookies to check if token is present
  const { token } = req.cookies; // Extract token from cookies
  
  // If no token is present, return an error response
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is not present, kindly log in first",
    });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode; // Attach decoded user data to the request object
    console.log("decoded data is", decode); // Log decoded data for debugging
  } catch (error) {
    // Log and handle errors during token verification
    console.log("error in decoding token", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  next(); // Proceed to the next middleware or route handler
};

// Middleware function to authorize Reader role
exports.isReader = async (req, res, next) => {
  try {
    console.log("data in user is", req.user); // Log user data for debugging
    const accountType = req.user.accountType; // Get the account type from user data

    // Check if the user is a Reader
    if (accountType !== "Reader") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for Readers only",
      });
    }
    next(); // Proceed if user is a Reader
  } catch (error) {
    // Log and handle errors during authorization
    console.log("error in authorizing Reader", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authorization",
    });
  }
};

// Middleware function to authorize Admin role
exports.isAdmin = async (req, res, next) => {
  try {
    console.log("data in user is", req.user); // Log user data for debugging
    const accountType = req.user.accountType; // Get the account type from user data

    // Check if the user is an Admin
    if (accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for Admins only",
      });
    }
    next(); // Proceed if user is an Admin
  } catch (error) {
    // Log and handle errors during authorization
    console.log("error in authorizing Admin", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authorization",
    });
  }
};

// Middleware function to authorize Admin or Author roles
exports.isAdminOrAuthor = async (req, res, next) => {
  try {
    console.log("User data:", req.user); // Log user data for debugging
    const accountType = req.user.accountType; // Get the account type from user data

    // Check if the user is either Admin or Author
    if (accountType !== "Admin" && accountType !== "Author") {
      return res.status(403).json({
        success: false,
        message: "Access restricted to Admins and Authors",
      });
    }
    next(); // Proceed if the user is either Admin or Author
  } catch (error) {
    // Log and handle errors during authorization
    console.log("Authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authorization",
    });
  }
};

  
