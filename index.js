var dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const routes = require('./Routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./Config/mongoose');
const MongoStore = require('connect-mongo');
const passport = require('./Config/passportLocal');
const passportGoogle = require('./Config/passportGoogle');
const passportGithub = require('./Config/passportGithub');
var session = require('express-session');

var connectFlash = require('connect-flash');


app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended:true}));
app.set('views',path.join(__dirname, 'Views'));
app.use(express.static(path.join(__dirname, 'Assets')));
app.use(session({
    name: process.env.mongoSession_name,
    // TODO change the secret before deployment in production mode
    secret: process.env.mongoSession_password,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100),
        httpOnly: true,
        secure: false
    },
    store: new MongoStore(
        {
            mongoUrl: process.env.mongo_uri,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());
app.use('/',routes);
app.listen(8000,(err)=>{
    if(err){
        console.log("Error in starting the server");
        return;
    }
    console.log('Server started at port 8000');
});


module.exports = app;
