const isAuthenticatedUser = (req, res, next) => {
  const isAuthenticated = !req.session.user_id ? false : true;
  if (isAuthenticated) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = isAuthenticatedUser;
