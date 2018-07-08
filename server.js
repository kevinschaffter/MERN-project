const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  users = require("./routes/api/users"),
  profile = require("./routes/api/profile"),
  posts = require("./routes/api/posts");

const app = express();

const db = require("./config/keys").mongoURI;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(db)
  .then(_ => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello"));

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
