const express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  Profile = require("../../models/Profile"),
  User = require("../../models/User"),
  validateProfileInput = require("../../validation/profile");

// router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);
    if (!profile) {
      errors.profile = "There is no profile for this user";
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (e) {
    res.status(404).json(e);
  }
});

router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if (typeof req.body.skills !== "undefined") profileFields.skills = req.body.skills.split(",");
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
      res.json(profile);
    } else {
      profile = await Profile.findOne({ handle: profileFields.handle });
      if (profile) {
        errors.handle = "That handle already exists";
        res.status(400).json(errors);
      }
      profile = await new Profile(profileFields).save();
      res.json(profile);
    }
  } catch (e) {
    res.status(404).json(e);
  }
});

module.exports = router;
