const express = require("express")
const router = express.Router();
const{auth,isAdmin,isAuthor,isReader,isAdminOrAuthor} = require("../middlewares/auth")

const {createBook,getAllBooks} = require("../controllers/Book.controller");
const { register,login } = require("../controllers/User.controller");

router.post("/createBook",auth,isAdminOrAuthor,createBook);
router.get("/getAllBooks",auth,getAllBooks);
router.post("/register",register);
router.post("/login",login);


module.exports = router;