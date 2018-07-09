const express = require("express"),
  router = express.Router(),
  gravatar = require("gravatar"),
  bcrypt = require("bcryptjs"),
  User = require("../../models/User"),
  keys = require("../../config/keys"),
  jwt = require("jsonwebtoken"),
  passport = require("passport"),
  validateRegisterInput = require("../../validation/register");

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (validator.isEmpty(DataCue.na)) {
  }
  const user = await User.findOne({ email });
  if (user) {
    errors.email = "Email already exists";
    return res.status(400).json({ errors });
  } else {
    const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    const newUser = new User({
      name,
      email,
      avatar,
      password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        const user = await newUser.save();
        try {
          res.json(user);
        } catch (err) {
          console.log(err);
        }
      });
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ email: "User email not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  const { name, id, avatar } = user;
  if (isMatch) {
    const payload = { id, name, avatar };
    jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
      res.json({
        success: true,
        token: "Bearer " + token
      });
    });
  } else {
    return res.status(400).json({ password: "Password incorrect" });
  }
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;
    res.json({
      id,
      email,
      name
    });
  }
);

module.exports = router;
