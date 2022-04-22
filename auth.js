const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    callbackURL: '/api/v1/auth/google/callback',
    passReqToCallback: true,
}, function (req, accessToken, refreshToken, profile, done) {
    // Documentation
    // https://www.passportjs.org/concepts/authentication/google/

    // User find or create
    // Instead of done it should be a cb (callback)
    /* 
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });

    */
    done(null, profile);
}));


// What are these functions used for?
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});