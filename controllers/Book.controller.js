const Book = require("../models/Book.model")
const cloudinary = require("cloudinary")

exports.createBook = async (req, res) => {
  const { title, Author, Year } = req.body;

  if (!title || !Author || !Year) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: "Cover image is required",
    });
  }

  try {
    // Access the cover file
    const cover = req.files.cover;

    console.log("cover file is",cover)
    // Upload cover image to Cloudinary
    const result = await cloudinary.uploader.upload(cover.tempFilePath, {
      folder: 'bookBank', // Specify a folder in Cloudinary
    });

    console.log("result is ",result)

    // Create a new book with the cover image URL
    const newBook = await Book.create({
      title,
      Author,
      Year,
      coverPage: result.secure_url, // Store Cloudinary URL in the database
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook,
    });
  } catch (error) {
    console.log("Error creating book:", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find(); // Await the database query
    return res.status(200).json({
      success: true,
      message: "All books are here",
      data: allBooks, // Changed key name to 'data' to follow conventions
    });
  } catch (error) {
    return res.status(500).json({ // Use 500 for server error
      success: false,
      message: "Books not found",
      error: error.message, // Optional: include error message for debugging
    });
  }
};

