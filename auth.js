const passport = require('passport');
const User = require('./models/User');
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

    // check if user already exists in our own db
    try {
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                // This user already exists
                done(null, currentUser);
            } else {
                // Creates a new user in our db
                const newUser = new User({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    googleId: profile.id,
                    profilePicture: profile._json.picture,
                });

                newUser.save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        })
    } catch (e) {
        console.log('Error creating user');
        done(e);
    }

}));


// What are these functions used for?
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    try {
        User.findById(id).then((user) => {
            done(null, user);
        });
    } catch (e) {
        console.log('Error serializing');
    }
});