const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,      
        required: true    
      },
      Author: {
        type: String,      
        required: true,    
                            
      },
      CoverPage: {
        type: String,     
            
      },
      Year: {
        type: Number,     
        required: true    
      }
})

// Create the Book model from the schema
const Book = mongoose.model('Book', bookSchema);

// Export the model
module.exports = Book;