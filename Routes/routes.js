const express = require("express");
const router = express.Router();

// Import middleware functions for authentication and authorization
const { auth, isAdmin, isAuthor, isReader, isAdminOrAuthor } = require("../middlewares/auth");

// Import controller functions for handling book and user operations
const { createBook, getAllBooks, updateBook, deleteBook, getBookById } = require("../controllers/Book.controller");
const { register, login, getUserDetails } = require("../controllers/User.controller");

// Route to create a new book
// Requires authentication and authorization (Admin or Author role)
router.post("/createBook", auth, isAdminOrAuthor, createBook);

// Route to get all books
// Requires authentication
router.get("/getAllBooks", auth, getAllBooks);

// Route to get a specific book by ID
// Requires authentication
router.get("/getBookById/:id", auth, getBookById);

// Route to delete a book by ID
// Requires authentication and authorization (Admin or Author role)
router.delete("/deleteBook/:id", auth, isAdminOrAuthor, deleteBook);

// Route to update a book by ID
// Requires authentication and authorization (Admin or Author role)
router.put("/updateBook/:id", auth, isAdminOrAuthor, updateBook);

// Route to register a new user
// No authentication required for registration
router.post("/register", register);

// Route to login a user
// No authentication required for login
router.post("/login", login);

// Route to get user details
// Requires authentication
router.get("/getUserDetails", auth, getUserDetails);

module.exports = router;
