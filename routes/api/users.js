const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

router.post("/register", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ email: "Email already exists" });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password
    });
  }
});

module.exports = router;
