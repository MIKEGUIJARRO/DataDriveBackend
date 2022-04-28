const { default: mongoose } = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const { getUserProfilePic } = require('../util/drive');
const ErrorResponse = require("../util/errorResponse");


const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    googleId: String,
    profilePicture: String,
    googleRefreshToken: String,
});

userSchema.pre('save', async function (next) {
    // Every time we are about to save a user we call this function

    //Get Users public url pic from google services
    try {
        console.log('RefreshToken: ', this.googleRefreshToken);
        console.log('GoogleId: ', this.googleId);
        this.profilePicture = await getUserProfilePic(this.googleRefreshToken, this.googleId);
        next();
    } catch (e) {
        throw new ErrorResponse('Error getting the user profile pic', 400);
    }
});

// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);