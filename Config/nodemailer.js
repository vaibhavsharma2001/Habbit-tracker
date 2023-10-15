const nodemailer  = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user:  process.env.nodemailer_email, // generated ethereal user
      pass: process.env.nodemailer_password, // generated ethereal password
    }
  });

function returnHtmlstring(data){  
    let htmlString='';
    ejs.renderFile(path.join(__dirname, '../Views/verificationMail.ejs'), data, function(err, str){
        if(err){
            console.log('Error in making html string from template');
            console.log(err);
            htmlString='';
            return;
        }
        htmlString = str;
    });  
    
    return htmlString;
}

module.exports = {
    transporter,
    returnHtmlstring
}