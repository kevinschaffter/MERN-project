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
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);
    })
  );
};
