const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");
const { strict } = require("assert");
const { nextTick } = require("process");
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

//middlewares
app.set("trust proxy", 1);
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

app.get("/",isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/homePage.html"));
});

app.get("/apartments", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/browseApartments.html"));
});

app.get("/add-apartment", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/addApartments.html"));
});

app.get("/feedback", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/feedback.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/login.html"));
});

app.get("/sign-up", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/signUp.html"));
});

app.post("/sign-Up", signUp);

function isAuth(req,res,next){
  console.log(req.cookies.cart);
  next();
}

function signUp(req, res) {
  const session = req.session.id;
  const user = req.body;
  const date = new Date();
  const expireDate =
    date.getFullYear() +
    "-" +
    date.getUTCMonth() +
    "-" +
    (date.getUTCDate() + 1);
    const day = 1000 * 60 * 5;

  // const query = `INSERT INTO users VALUES (${user.username},${user.email},${user.password},"user",${session},${fullExpire});`;
  const query = `INSERT INTO users VALUES ("${user.username}","${user.email}","${user.password}","user","${session}","${expireDate}");`;
  connection.query(query, (error, results) => {
    if (error) res.sendStatus(500);
    else {
      res.cookie('sid', session, { httpOnly:true, secure:true, maxAge: fiveMin })
      res.sendStatus(200);
    }
  });
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
