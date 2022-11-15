const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const mysql = require("mysql");
const { strict } = require("assert");
const { nextTick } = require("process");
const { runInNewContext } = require("vm");
const { getCipherInfo } = require("crypto");
const db_config = {
  host: "bys5wwtnkth0revav7bf-mysql.services.clever-cloud.com",
  database: "bys5wwtnkth0revav7bf",
  user: "ucrxskdlf6viqdw9",
  password: "qClvxbEoOw9mQ7KpQfkg",
  waitForConnections: true,
  connectionLimit: 10,
};
let connection;
handleDisconnect();

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

//middlewares
app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/pages/"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "shhhh!! this is a secret key",
    resave: false,
    saveUninitialized: false,
  })
);
app.get("/", getInfo, (req, res) => {
  res.render("homePage", { user: req.user, logged: req.logged });
});

app.get("/apartments", isAuth, (req, res) => {
  res.render("browseApartments", { user: req.user, logged: req.logged });
});

app.get("/add-apartment", isAuth, (req, res) => {
  res.render("addApartments", { user: req.user, logged: req.logged });
});

app.get("/feedback", getInfo, (req, res) => {
  res.render("feedback", { user: req.user, logged: req.logged });
});

app.get("/login", isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/login.html"));
});

app.post("/login", login);

app.get("/sign-up", isAuth, function sign(req, res) {
  res.sendFile(path.join(__dirname, "public/pages/signUp.html"));
});

app.post("/sign-Up", signUp);

function getInfo(req, res, next) {
  const session = req.cookies.sid;
  if (session) {
    const query = `select * from users where sessionID = "${session}" and sessionIDExpires > NOW();`;
    connection.query(query, (error, results) => {
      if (error || results.length < 1) {
        res.clearCookie("sid");
        req.logged = false;
        next();
      } else {
        req.logged = true;
        req.user = results[0];
        next();
      }
    });
  } else {
    console.log("here");
    res.clearCookie("sid");
    req.logged = false;
    next();
  }
}

function isAuth(req, res, next) {
  const session = req.cookies.sid;
  if (session) {
    const query = `select * from users where sessionID = "${session}" and sessionIDExpires > NOW();`;
    connection.query(query, (error, results) => {
      if (error || results.length < 1) {
        res.clearCookie("sid");
        res.redirect("/login");
      } else if (
        results[0].privilege !== "admin" &&
        req.path === "/add-apartment"
      ) {
        res.redirect("/");
      } else if (req.path === "/login" || req.path === "/sign-up") {
        res.clearCookie("sid");
        res.redirect("/login");
      } else {
        req.logged = true;
        req.user = results[0];
        next();
      }
    });
  } else if (req.path === "/login" || req.path === "/sign-up") {
    next();
  } else {
    res.redirect("/login");
  }
}

function login(req, res) {
  const session = req.session.id;
  const user = req.body;
  const expirationDate = getExpireDate();
  const fiveMin = 1000 * 60 * 5;
  const query = `select * from users where email = "${user.email}" and password = "${user.password}";`;
  const updateQuery = `update users set sessionIDExpires = "${expirationDate}", sessionID = "${session}" where email = "${user.email}";`;

  connection.query(query, (error, results) => {
    if (error || results.length < 1) {
      console.log(error);
      res.sendStatus(505);
    } else {
      connection.query(updateQuery, (error, results) => {
        if (error) {
          console.log(error);
          res.sendStatus(505);
        } else {
          res.cookie("sid", session, {
            httpOnly: true,
            secure: true,
            maxAge: fiveMin,
          });
          res.sendStatus(200);
        }
      });
    }
  });
}

function signUp(req, res) {
  const session = req.session.id;
  const user = req.body;
  const expirationDate = getExpireDate();
  const fiveMin = 1000 * 60 * 5;
  const query = `INSERT INTO users VALUES ("${user.username}","${user.email}","${user.password}","user","${session}","${expirationDate}");`;

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.sendStatus(505);
    } else {
      res.cookie("sid", session, {
        httpOnly: true,
        secure: true,
        maxAge: fiveMin,
      });
      res.sendStatus(200);
    }
  });
}

function getExpireDate() {
  const date = new Date();
  const expireDate =
    date.getFullYear() +
    "-" +
    (date.getUTCMonth() + 1) +
    "-" +
    date.getUTCDate();
  const expireTime =
    date.getUTCHours() +
    ":" +
    ((date.getUTCMinutes() + 5)% 60) +
    ":" +
    date.getUTCSeconds();
  const fullExpire = expireDate + " " + expireTime;
  return fullExpire;
}

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 3000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", function (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
