var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var helmet = require('helmet');

var Rcourses = require('./routes/courses');
var Rstudents = require('./routes/students');
var RWcourse = require('./routes/web_courses');
var RWstudents = require('./routes/web_students');
var RWindex = require('./routes/index');

var app = express();

//Set up mongoose connection
const dev_db_url = "mongodb+srv://mahmoudothman:lms1234.@cluster0.zw6ko.mongodb.net/LMS?retryWrites=true&w=majority";
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(compression());
app.use(helmet());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', RWindex);
app.use('/api/courses', Rcourses);
app.use('/api/students', Rstudents);
app.use('/web/courses', RWcourse); 
app.use('/web/students', RWstudents);

module.exports = app;
