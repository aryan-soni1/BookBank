// Import mongoose
const mongoose = require("mongoose");

// Import the User model to reference in the book schema
const User = require("./Users.models");

// Define the book schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,      // The data type for the title field is String
    required: true,    // The title field is required
  },
  Author: {
    type: String,      // The data type for the Author field is String
    required: true,    // The Author field is required
  },
  CoverPage: {
    type: String,      // The data type for the CoverPage field is String
    required:true
  },
  Year: {
    type: Number,      // The data type for the Year field is Number
    required: true,    // The Year field is required
  },
  AuthorId: {
    type: mongoose.Schema.Types.ObjectId, // The type for AuthorId field is ObjectId
    ref: "User", // Reference the User model by name (string)
    // This creates a relationship between Book and User models
  }
});

// Create the Book model from the schema
const Book = mongoose.model('Book', bookSchema);

// Export the model for use in other parts of the application
module.exports = Book;
