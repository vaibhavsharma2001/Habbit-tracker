var User = require('../Models/user')
var Token = require('../Models/token');
var passport = require('passport');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const request = require('request');
var nodeMailer = require('../Config/nodemailer');
const mongoose = require('mongoose');
const {gfs} = require('../Config/mongoose');
var TokenGenerator = require( 'token-generator' )({
  salt: 'blah something',
  timestampMap: new Date().getTime().toString().substring(0,10), // 10 chars array for obfuscation proposes
});
var logIn = function(req,res){
    res.render('auth',{
      message: req.flash('error'),
      filepath: 'auth'
    });
}
var captchaCheck = function(req,res,next){
    const response_key = req.body["g-recaptcha-response"];
    const secret_key = process.env.captcha_secretKey;
    const options = {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
    }
    request(options,function(err,re){
        if(err){
          req.flash('error','Got Captcha error');
          res.redirect('/users/login');
        }
        /*if (JSON.parse(re.body)['success'] || !JSON.parse(re.body)['success']) {
          req.flash('error','Captcha not verified');
          res.redirect('/users/login');
        }*/
        next();
    }); 
}


var logout = function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/users/login');
    });
  }

var createSession = function(req, res, next) {
  User.uploadDetails(req, res,function (err) {
    if (err) {
      next(err);
    }

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      let userprocess = {
          'userName':req.body.userName,
          'email': req.body.email,
          'password': hash,
          'tasks': [],
          'profilePhoto':'null'
        }
        User.create(userprocess,function(error,user){
          if(error){
            console.log(error);
          }
          req.login(user, function(err) {
            if (err) { return next(err); }
            res.redirect('/');
          });
        });    
    });

    
  });
  
} 

var checkAuth = function(req,res,next){
  if(req.isAuthenticated()){
      next();
      return;
  }
  res.redirect('/users/login');

}

var forgotPassword = function(req,res){
  User.uploadDetails(req, res,function (err) {
    if (err) {
      res.status(200).json({
        code: 500,
        error: 'Interal Server Error'
      })
      return;
    }
    let user = {
      'email': req.body.email,
    }

    User.findOne(user,function(err,user){
      if(err){
        res.status(200).json({
          code: 500,
          error: 'Interal Server Error'
        });
        return;
      }
      if(!user){
        res.status(200).json({
          code: 404,
          error: 'User for specified Email Address was not found...'
        });
        return;
      }

      var tokenString = TokenGenerator.generate();
      var data = {
        user:{
          id: user._id,
          name: user.userName
        },
        token:tokenString,
      }
      var htmlString = nodeMailer.returnHtmlstring(data);

      Token.create({
        userId: user._id,
        token: tokenString
      },function(err,token){
        if(err){
          console.log("There was error adding to token to database");
          res.status(200).json({
            code: 500,
            error: 'Internal Server Error'
          });
          return;

        }

        nodeMailer.transporter.sendMail(
          {
            from: "Harshit Gupta @ Habbit Tracker", // sender address
            to: user.email, // list of receivers
            subject: "Please reset your Password", // Subject line
            html: htmlString, // html body
          },function(err,info){
            if(err){
              console.log('There was an error in sending the message',err);
              res.status(200).json({
                code: 500,
                error: 'Internal Server Error'
              });
              return;
            }
            console.log('Message Sent successfully');
            res.status(200).json({
              code: 200,
              message: 'Verification Link Sent to registered Email Address...'
            })
          }
        );
  
  


      });
      

    })
  
})
}

var resetPassword = function(req,res){
  Token.findOne({
    userId: req.params.userId,
    token: req.params.tokenId
  },function(err,token){
    if(err){
      res.render('session-expired',{
        filepath: 'session-expired'
      });
      return;
    }
    if(!token){
      res.render('session-expired',{
        filepath: 'session-expired'
      });
      return;
    }

    res.render('reset-password',{
      userId: req.params.userId,
      tokenId: req.params.tokenId,
      filepath: 'reset-password'
    });

  })
}

var changePassword = function(req,res){
  User.uploadDetails(req, res,function (err) {
    if (err) {
      res.status(200).json({
        code: 500,
        error: 'Internal server Error'
      })
      return;
    }
    Token.findOneAndDelete({
      userId: req.params.userId,
      token: req.params.tokenId
    },function(err,token){
      if(err){
        res.status(500).json({
          code: 500,
          message: 'Internal server Error'
        })
        return;
      }
      User.findOne({
        _id:req.params.userId
      },function (err, user) {
        if(err){
          res.status(200).json({
            code: 500,
            error: 'Internal server Error'
          })
          return;
        }
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
          // Store hash in your password DB.
          //console.log(req.body.password);
          user.password = hash;
          user.save();
          res.status(200).json({
            code: 200,
            message:'Password Changed..'
          })
        });
        
      })
    })
  });
}

var changePasswordinside = async function(req,res){
  try{
    const hash = await bcrypt.hash(req.body['password-changePassword'], saltRounds);
    const user = await User.findOne({_id:mongoose.Types.ObjectId(req.params.userId)});
    user.password = hash;
    await user.save();
    res.status(200).json({
      code: 200,
      message: "Password Changed..."
    })
  }catch(err){
    res.status(200).json({
      code: 500,
      message: err.message
    })
  }
}

var changePhoto= async function(req,res){
  try{
    const user = await User.findOne({_id:mongoose.Types.ObjectId(req.params.userId)});
    let uploadStream = await gfs.gridfsBucket.openUploadStream(req.file.originalname);
    uploadStream.end(req.file.buffer);
    uploadStream.on('finish', async function(file) {
      console.log('File saved to MongoDB');
      // Save a reference to the file in the user document
      user.profilePhoto = file._id;
      await user.save();
    });

    res.status(200).json({
      code: 200,
      message:"Photo Changed.."
    })
  }catch(err){
    console.log(err);
    res.status(200).json({
      code: 500,
      message: err.message
    })
  }
}

module.exports ={
    logIn,
    logout,
    createSession,
    checkAuth,
    forgotPassword,
    resetPassword,
    changePassword,
    captchaCheck,
    changePasswordinside,
    changePhoto
}