let express = require("express");
let app = express();
let path = require("path");
let newpath = path.join(__dirname, "..", "/database");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
let database = require(newpath + "/mongo.js");

app.get("/sell", (req, res) => {
  res.render("sell");
});
app.get("/daretologin", (req, res) => {
  res.render("login");
});

module.exports = app;
