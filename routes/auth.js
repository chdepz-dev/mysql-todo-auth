
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");


//Display login page
router.get("/login", authController.getLogin);

//handle login form submission
router.post("/login", authController.login);

//Display registration page
router.get("/register", authController.getRegister);

//handle registration form submission
router.post("/register", authController.register);

//handle logout
router.get("/logut", authController.logout);

module.exports = router;