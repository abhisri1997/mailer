const users = require("../data/users");

const logoutController = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.clearCookie("userID");
      res.redirect("/");
    }
  });
};

module.exports = logoutController;
