// Import mongoose
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,      // The data type for the name field is String
    required: true     // The name field is required
  },
  email: {
    type: String,      // The data type for the email field is String
    required: true,    // The email field is required
    unique: true       // The email field must be unique
  },
  password: {
    type: String,      // The data type for the password field is String
    required: true     // The password field is required
  },

  accountType: {
    type: String,
    enum: ["Reader", "Author", "Admin"],
    required: true,
},
});

// Create the user model from the schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;