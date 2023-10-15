var GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const crypto = require('crypto');
const User = require('../Models/user');

passport.use(new GitHubStrategy({
    clientID: process.env.githubSignin_clientID,
    clientSecret: process.env.githubSignin_clientSecret,
    callbackURL: "https://habbit-tracker-three.vercel.app/users/auth/github/callback",
  },
  function(accessToken, refreshToken, profile, done){
    // find a user
    User.findOne({email: String(profile.username)}).exec(function(err, user){
        if (err){console.log('error in finding user', err); return;}
        
        if (user){
            // if found, set this user as req.user
            return done(null, user);
        }else{
            // if not found, create the user and set it as req.user
            User.create({
                userName: String(profile.displayName),
                email: String(profile.username),
                password: crypto.randomBytes(20).toString('hex'),
                tasks: [],
                profilePhoto:'null'
            }, function(err, user){
                if (err){console.log('error in creating user ', err); return;}

                return done(null, user);
            });
        }

    }); 
}
));


module.exports = passport;