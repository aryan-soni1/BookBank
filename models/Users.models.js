// Import mongoose
const mongoose = require("mongoose");

// Import the Book model
const Book = require("./Book.model");

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String, // The data type for the name field is String
    required: true, // The name field is required
  },
  email: {
    type: String, // The data type for the email field is String
    required: true, // The email field is required
    unique: true, // The email field must be unique across all users
  },
  password: {
    type: String, // The data type for the password field is String
    required: true, // The password field is required
  },
  accountType: {
    type: String, // The type for accountType field is String
    enum: ["Reader", "Author", "Admin"], // Enumerate the possible values for accountType
    required: true, // The accountType field is required
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId, // The type for books field is ObjectId
      ref: "Book", // Reference the Book model by name (string)
    },
  ],
});

// Create the user model from the schema
const User = mongoose.model("User", userSchema);

// Export the model for use in other parts of the application
module.exports = User;
