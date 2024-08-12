const express = require("express");
const app = express();
const connectDB = require('./config/db')
const routes = require("./Routes/routes")
const cookieParser = require("cookie-parser")
const {cloudinaryConnect} = require("./config/cloudinary")
const fileUpload = require("express-fileupload")

require("dotenv").config();
const port = process.env.PORT
connectDB()

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  }));
  
  // Cloudinary connection
  cloudinaryConnect();
  console.log("cloudinary connected successfully")
app.use("/",routes)

app.get("/",(req,res)=>{
    res.send("hello bro what is your mobile number")
})

app.listen(port,()=>{
    console.log("server is listening at port ",port)
})
