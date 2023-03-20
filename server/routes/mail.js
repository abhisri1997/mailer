const express = require("express");
const router = express.Router();
const path = require("path");
const { updateMail, sendMail } = require("../controller/mailController");
const isAuthenticatedUser = require("../middleware/isAuthenticatedUser");

// Serve mail folder if user is authenticated
router.use(
  "/",
  isAuthenticatedUser,
  express.static(path.join(__dirname, "./../../mail"))
);

// Delete a mail item
router.put("/updateMail", isAuthenticatedUser, updateMail);

// Send a mail and update the users inbox and sent folders
router.put("/sendMail", isAuthenticatedUser, sendMail);

module.exports = router;
