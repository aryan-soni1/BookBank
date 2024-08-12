const express = require("express")
const router = express.Router();

const {createBook} = require("../controllers/Book.controller");
const { register,login } = require("../controllers/User.controller");

router.post("/createBook",createBook);
router.post("/register",register);
router.post("/login",login);


module.exports = router;