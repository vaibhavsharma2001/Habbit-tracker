const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../Controllers/user')
const User = require('../Models/user');
router.post('/sign-up/password',userController.captchaCheck,userController.createSession);
router.get('/login',userController.logIn);
router.post('/login/password', User.uploadDetails,userController.captchaCheck,passport.authenticate('local',{
  failureFlash: true,
  failureRedirect: "/users/login/error",
  failureMessage: true

}),function(req,res){
  res.redirect('/');

});

router.get('/login/error',function(req,res){
  req.flash('error','Username or Password is incorrect');
  res.redirect('/users/login');
})

router.post('/login/forgotpassword',userController.forgotPassword);

router.get('/login/reset-password/:userId/:tokenId',userController.resetPassword);

router.post('/login/reset-password/:userId/:tokenId',userController.changePassword);

/*router.post('/login/password', User.uploadDetails,function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log("authenticate");
        console.log(err);
        console.log(user);
        console.log(info);
    })(req, res, next);
});*/
router.get('/logout', userController.logout);  

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/login'}), function(req,res){
  res.redirect('/');
});
router.get('/auth/github',passport.authenticate('github', {scope: ['profile', 'email']}));
router.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/users/login'}), function(req,res){
  res.redirect('/');
});

router.post('/changePassword-inside/:userId',userController.checkAuth,User.uploadDetails,userController.changePasswordinside);
router.post('/change-photo/:userId',userController.checkAuth,User.uploadPhotos,userController.changePhoto);



module.exports = router;