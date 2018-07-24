const express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  Profile = require('../../models/Profile'),
  User = require('../../models/User'),
  validateProfileInput = require('../../validation/profile'),
  validateExperienceInput = require('../../validation/experience'),
  validateEducationInput = require('../../validation/education');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
    if (!profile) {
      errors.profile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (e) {
    res.status(404).json(e);
  }
});

router.get('/handle/:handle', async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({ handle: req.params.handle }).populate('user', ['name', 'avatar']);
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }
    res.json(profile);
  } catch (e) {
    res.status(404).json(e);
  }
});

router.get('/user/:user_id', async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }
    res.json(profile);
  } catch (e) {
    res.status(404).json(e);
  }
});

router.get('/all', async (req, res) => {
  const errors = {};
  try {
    const profiles = await Profile.find();
    if (!profiles) {
      errors.noprofile = 'There are no profiles';
      res.status(404).json(errors);
    }
    res.json(profiles);
  } catch (e) {
    res.status(404).json(e);
  }
});

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) return res.status(400).json(errors);
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
    if (typeof req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(',');
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
        errors.handle = 'That handle already exists';
        res.status(400).json(errors);
      }
      profile = await new Profile(profileFields).save();
      res.json(profile);
    }
  } catch (e) {
    res.status(404).json(e);
  }
});

router.post('/experience', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  const profile = await Profile.findOne({ user: req.user.id });
  const newExp = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description
  };
  profile.experience.unshift(newExp);
  await profile.save();
  res.json(profile);
});

router.post('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);
  if (!isValid) return res.status(400).json(errors);
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };
    profile.education.unshift(newEdu);
    await profile.save();
    res.json(profile);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
