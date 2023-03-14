const express = require("express");
const path = require("path");
const isAuthenticatedUser = require("../logic/isAuthenticatedUser");
const loginController = require("./../controller/loginController");
const signupController = require("./../controller/signupController");
const logoutController = require("./../controller/logoutController");
const users = require("./../data/users");

const router = express.Router();

router.post("/login", loginController);
router.post("/signup", signupController);

// Serve mail folder if user is authentic
router.use(
  "/mail",
  isAuthenticatedUser,
  express.static(path.join(__dirname, "./../../mail"))
);
router.get("/logout", logoutController);

// Get a single user
router.get("/users/:id", isAuthenticatedUser, (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    res.status(404).send("The user with the given ID was not found.");
  }
  res.send(user);
});

// // Update a user
// router.put("/users/:id", (req, res) => {
//   const user = users.find((user) => user.id === parseInt(req.params.id));
//   if (!user) {
//     res.status(404).send("The user with the given ID was not found.");
//   }
//   user.username = req.body.username;
//   user.password = req.body.password;
//   res.send(user);
// });

// // Delete a user
// router.delete("/users/:id", (req, res) => {
//   const user = users.find((user) => user.id === parseInt(req.params.id));
//   if (!user) {
//     res.status(404).send("The user with the given ID was not found.");
//   }
//   const index = users.indexOf(user);
//   users.splice(index, 1);
//   res.send(user);
// });

module.exports = router;
