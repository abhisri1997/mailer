const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const router = require("./routes/router");
const session = require("express-session");
const generateSecretKey = require("./logic/generateSecretKey");

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

router.use(
  "/",
  (req, res, next) => {
    if (!req.session.user_id) {
      next();
    } else {
      res.redirect("/mail");
    }
  },
  express.static(staticPath)
);

app.use("/", router);

app.listen(PORT, () => console.log(`Server running on ${HOST}:${PORT}`));
