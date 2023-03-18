const express = require("express");
const path = require("path");
const isAuthenticatedUser = require("../middleware/isAuthenticatedUser");
const loginController = require("./../controller/loginController");
const signupController = require("./../controller/signupController");
const logoutController = require("./../controller/logoutController");
const users = require("./../data/users");
const { getSingleUser } = require("./../controller/userController");
const { updateMail, sendMail } = require("../controller/mailController");

const router = express.Router();

// Log In user
router.post("/login", loginController);

// Sign Up user
router.post("/signup", signupController);

// Serve mail folder if user is authenticated
router.use(
  "/mail",
  isAuthenticatedUser,
  express.static(path.join(__dirname, "./../../mail"))
);

// Log out user
router.get("/logout", logoutController);

// Get a single user
router.get("/users/:id", isAuthenticatedUser, getSingleUser);

// Delete a mail item
router.put("/mail/updateMail", isAuthenticatedUser, updateMail);

// Send a mail and update the users inbox and sent folders
router.put("/mail/sendMail", isAuthenticatedUser, sendMail);

module.exports = router;
