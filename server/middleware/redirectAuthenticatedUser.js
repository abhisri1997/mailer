const redirectAuthenticatedUser = (req, res, next) => {
  const isAuthenticated = !req.session.user_id ? false : true;
  // if user is authenticated and tries to access /, redirect to /mail
  // else continue to next middleware
  // this is to prevent users from accessing /mail if they are not logged in
  // and to prevent users from accessing / if they are logged in
  // !Important req.path fixes infinite redirect loop
  if (isAuthenticated && req.path === "/") {
    res.redirect("/mail");
  } else {
    next();
  }
};

module.exports = redirectAuthenticatedUser;
