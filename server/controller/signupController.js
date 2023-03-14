const users = require("../data/users");

const signupController = (req, res) => {
  const { email, password, name, sent, inbox, drafts, trash } = req.body;

  const user = users.find((u) => u.email === email || u.username === email);
  if (user) {
    res.status(409).json({ error: "User already exist" });
  } else {
    const username = email.split("@")[0];
    const newUser = {
      id: users.length + 1,
      name,
      username,
      email,
      password,
      sent,
      inbox,
      drafts,
      trash,
    };
    users.push(newUser);
    console.log("New User Created", users);
    req.session.user_id = newUser.id;
    res.cookie("userID", newUser.id, {
      expires: new Date(Date.now() + 900000), // 15 minutes
    });
    res.status(201).json({ message: "Signup successful" });
  }
};

module.exports = signupController;
