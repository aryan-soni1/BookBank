const Book = require("../models/Book.model");
const cloudinary = require("cloudinary").v2; // Use v2 for Cloudinary
const User = require("../models/Users.models");

// Controller to handle book creation
exports.createBook = async (req, res) => {
  const { title, Author, Year } = req.body;

  // Validate that required fields are present
  if (!title || !Author || !Year) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  // Check if cover image is provided
  if (!req.files || !req.files.cover) {
    return res.status(400).json({
      success: false,
      message: "Cover image is required!",
    });
  }

  try {
    // Access the cover file
    const cover = req.files.cover;

    // Upload cover image to Cloudinary
    const result = await cloudinary.uploader.upload(cover.tempFilePath, {
      folder: 'bookBank', // Specify a folder in Cloudinary
    });

    // Create a new book with the cover image URL
    const newBook = await Book.create({
      title,
      Author,
      Year,
      CoverPage: result.secure_url,
      AuthorId: req.user.id // Associate the book with the user
    });

    // Update the user's document to include the new book
    await User.findByIdAndUpdate(req.user.id, {
      $push: { books: newBook._id } // Add the new book's ObjectId to the author's books array
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      newBook: newBook,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Controller to retrieve all books
exports.getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find(); // Fetch all books from the database

    if (allBooks.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No books found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "All books retrieved successfully",
      data: allBooks, // Follow conventions by using 'data' as the key
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Controller to retrieve a book by ID
exports.getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the book by ID and populate the author details
    const book = await Book.findById(id).populate('AuthorId'); // Populate the 'AuthorId' field

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book found",
      book: book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Controller to update a book
exports.updateBook = async (req, res) => {
  const { title, Author, Year } = req.body;
  const { id } = req.params;

  try {
    // Find the book by ID
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Update fields if provided
    if (title) book.title = title;
    if (Author) book.Author = Author;
    if (Year) book.Year = Year;

    // Check if a new cover image is provided
    if (req.files && req.files.cover) {
      // Optionally delete the old cover image from Cloudinary
      if (book.CoverPage) {
        const publicId = book.CoverPage.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(`bookBank/${publicId}`);
      }

      // Upload the new cover image
      const cover = req.files.cover;
      const result = await cloudinary.uploader.upload(cover.tempFilePath, {
        folder: 'bookBank',
      });

      // Update the cover image URL
      book.CoverPage = result.secure_url;
    }

    // Save the updated book
    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Controller to delete a book
exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the book by ID
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Optionally delete the cover image from Cloudinary
    if (book.CoverPage) {
      const publicId = book.CoverPage.split('/').pop().split('.')[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(`bookBank/${publicId}`);
    }

    // Delete the book from the database
    await Book.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
