var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost/CMS',{ useNewUrlParser: true })
        .then((db)=>{
            console.log("MongoDB Connected");
        })
        .catch(error => console.log(error));

var homeRouter = require('./routes/home/index');
var adminRouter = require('./routes/admin/index');
var postsRouter = require('./routes/admin/posts');
var app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Method-Override
app.use(methodOverride('_method'));

//Template engine
const {select} = require('./helpers/handlebars-helpers');
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers:{select:select}}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express-session
app.use(session({
    secret: 'phananh',
    resave: false,
    saveUninitialized: true,
  }));

//Upload Middleware
app.use(upload());

//Flash-connect
app.use(flash());
app.use((req,res,next) =>{
    res.locals.success_message = req.flash('success_message');
    next();
});


app.use('/', homeRouter);
app.use('/admin', adminRouter);
app.use('/admin/posts', postsRouter);

module.exports = app;
