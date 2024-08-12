const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  console.log("cookies are", req.cookies);
  const {token} = req.cookies;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "token is not present",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
     console.log("decoded data is", decode);
  } catch (error) {
    console.log("error in decoding token",error)
  }

  next()
};

exports.isReader = async(req,res,next)=>{
    try {
        console.log("data in user is",req.user)
        const accountType = req.user.accountType

        if(accountType !== "Reader"){
            return res.status(400).json({
                success: false,
                message: "This is a protected route for reader",
              });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "we can't give authority to reader for this route",
          });
          console.log(error)
    }
}
exports.isAuthor = async(req,res,next)=>{
    try {
        console.log("data in user is",req.user)
        const accountType = req.user.accountType

        if(accountType !== "Author"){
            return res.status(400).json({
                success: false,
                message: "This is a protected route for Author",
              });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "error in authorize Author",
          });
          console.log(error)
    }
}
exports.isAdmin = async(req,res,next)=>{
    try {
        console.log("data in user is",req.user)
        const accountType = req.user.accountType

        if(accountType !== "Admin"){
            return res.status(400).json({
                success: false,
                message: "This is a protected route for Admin",
              });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "error in authorize Admin",
          });
          console.log(error)
    }
}

exports.isAdminOrAuthor = async (req, res, next) => {
    try {
      console.log("User data:", req.user);
      const accountType = req.user.accountType;
  
      if (accountType !== "Admin" && accountType !== "Author") {
        return res.status(403).json({
          success: false,
          message: "Access restricted to Admins and Authors",
        });
      }
  
      next(); // Proceed if the user is either Admin or Author
    } catch (error) {
      console.log("Authorization error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during authorization",
      });
    }
  };
  
