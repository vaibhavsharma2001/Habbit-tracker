var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../Models/user');
const bcrypt = require('bcryptjs');
const request = require('request');
const saltRounds = 10;

var strategy = new LocalStrategy({ // or whatever you want to use
    usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'
  },
    function verify(email, password,cb){
    User.findOne({email:email},{_id:0,userName:0,tasks:0},function(err,user){
        if(err){
            return cb(err);
        }
        if(!user){
            return cb(null,false,{message: ''});
        }
        
        bcrypt.compare(password, user.password, function(err, result) {
            // result == true
            //console.log(password);
            if(result){
                return cb(null,user);
            }else{
                return cb(null,false,{message: ''});
            }
        });

    })
})

passport.use(strategy);

passport.serializeUser(function(user, cb) {
      return cb(null, {
        email: user.email,
        userName: user.userName,
        profilePhoto: user.profilePhoto
      });
  });
  
passport.deserializeUser(function(user, cb) {
    User.findOne({email: user.email}, function(err, user) {
        if(err){
            return cb(err);
        }
        if(!user){
            return cb(null,false,{message: 'User cannot be found'});
        }
        //console.log(user);
        return cb(null,user);
    })
  });
  

module.exports = passport;