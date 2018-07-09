const JwtStrategy = require("passport-jwt").Strategy,
  { ExtractJwt } = require("passport-jwt"),
  mongoose = require("mongoose"),
  User = mongoose.model("users"),
  keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const user = await User.findById(jwt_payload.id);
      if (user) return done(null, user);
      try {
        return done(null, false);
      } catch (err) {
        console.log(err);
      }
    })
  );
};
