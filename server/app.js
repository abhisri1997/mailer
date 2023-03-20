const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const generateSecretKey = require("./config/generateSecretKey");
const mailRouter = require("./routes/mail");

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "http://127.0.0.1";
const secretKey = generateSecretKey();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
  })
);

const staticPath = path.join(__dirname, "./../public");
// if user is logged in, redirect to /mail else serve static files
app.use((req, res, next) => {
  if (req.session.user_id) {
    console.log("user is logged in");
    res.redirect("/mail");
  } else {
    next();
  }
});
app.use(express.static(staticPath));

app.use("/user", require("./routes/user"));

app.use("/mail", mailRouter);

app.listen(PORT, () => console.log(`Server running on ${HOST}:${PORT}`));
