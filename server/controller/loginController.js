const users = require("../data/users");
const path = require("path");

const loginController = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === password
  );

  if (user) {
    req.session.user_id = user.id;
    res.cookie("userID", user.id, {
      expires: new Date(Date.now() + 900000), // 15 minutes
    });
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
};

module.exports = loginController;
