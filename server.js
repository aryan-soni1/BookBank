const express = require("express");
const app = express();
const connectDB = require('./db')
const routes = require("./Routes/routes")

require("dotenv").config();
const port = process.env.PORT
connectDB()

app.use(express.json());
app.use("/",routes)

app.get("/",(req,res)=>{
    res.send("hello bro what is your mobile number")
})

app.listen(port,()=>{
    console.log("server is listening at port ",port)
})
