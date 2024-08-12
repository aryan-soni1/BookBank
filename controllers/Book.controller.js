const Book = require("../models/Book.model")

const createBook = async(req,res)=>{

    const {title,Author,Year} = req.body;
    
    if(!title || !Author || !Year){
       return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    try {
        const newBook = await Book.create({title,Author,Year})
        res.status(201).json({ message: 'Book created successfully', Book });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    
}

module.exports = {
    createBook,
  };