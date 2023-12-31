//console.log(process.env.GOOGLE_clientID);
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();
const passport = require('passport');
const crypto = require('crypto');
const User = require('../Models/user');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: process.env.googleSignin_clientID,
        clientSecret: process.env.googleSignin_clientSecret,
        callbackURL: "https://habbit-tracker-three.vercel.app/users/auth/google/callback",
    },

    function(accessToken, refreshToken, profile, done){
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log('error in google strategy-passport', err); return;}
            
            if (user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    tasks: [],
                    profilePhoto:'null'
                }, function(err, user){
                    if (err){console.log('error in creating user google strategy-passport', err); return;}

                    return done(null, user);
                });
            }

        }); 
    }


));


module.exports = passport;
