// Get a single user
const express = require("express");
const router = express.Router();
const isAuthenticatedUser = require("../middleware/isAuthenticatedUser");
const { getSingleUser } = require("../controller/userController");
const loginController = require("../controller/loginController");
const signupController = require("../controller/signupController");
const logoutController = require("../controller/logoutController");

// Log In user
router.post("/login", loginController);

// Sign Up user
router.post("/signup", signupController);

// Log out user
router.get("/logout", logoutController);

router.get("/:id", isAuthenticatedUser, getSingleUser);

module.exports = router;
