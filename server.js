const express = require("express");
const app = express();
const connectDB = require('./config/db');
const routes = require("./Routes/routes");
const cookieParser = require("cookie-parser");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

// Port from environment variables
const port = process.env.PORT;

// Connect to the MongoDB database
connectDB();

// Middleware setup
app.use(express.json());           // Parse JSON bodies
app.use(cookieParser());          // Parse cookies
app.use(fileUpload({
    useTempFiles: true,           // Use temporary files for uploads
    tempFileDir: "/tmp",          // Directory for temporary files
}));

// Connect to Cloudinary for file management
cloudinaryConnect();

// Set up routes
app.use("/api/v1/", routes);

// Basic route for testing
app.get("/", (req, res) => {
    res.send("Hello! What's up?");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
