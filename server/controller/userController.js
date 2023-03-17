const users = require("../data/users");

const getSingleUser = (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    res.status(404).send("The user with the given ID was not found.");
  }
  res.send(user);
};

module.exports = { getSingleUser };
