const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const generateSecretKey = require("./config/generateSecretKey");
const redirectAuthenticatedUser = require("./middleware/redirectAuthenticatedUser");

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
app.use(redirectAuthenticatedUser);
app.use(express.static(staticPath));

app.use("/user", require("./routes/user"));

app.use("/mail", require("./routes/mail"));

app.listen(PORT, () => console.log(`Server running on ${HOST}:${PORT}`));
