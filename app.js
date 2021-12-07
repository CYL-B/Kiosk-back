require('./models/db');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var companiesRouter = require('./routes/companies');
var conversationsRouter = require('./routes/conversations')

var app = express();

app.locals.dateFormat = function(date){
    var newDate = new Date(date);
    var format = newDate.getDate()+'/'+(newDate.getMonth()+1)+'/'+newDate.getFullYear();
    return format;
  }


app.use(logger('dev'));
app.use(express.json());   
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/companies', companiesRouter);
app.use('/conversations', conversationsRouter)
module.exports = app;
