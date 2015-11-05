var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./settings');
var ejs = require('ejs');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//设置可以使用thml 和ejs文件
app.set('html',ejs);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:settings.cookieSecret,
  store:new MongoStore({
    db:settings.db,
    host:settings.host,
    port:settings.port
  }),
    resave:false,
    saveUninitialized:true
}))

app.use(flash());

// helpers 2.0版本
/*app.dynamicHelpers({
  user:function(req,res){
    req.session.user;
  },
  error:function(req,res){
    var err = req.flash('error');
    if (err.length) {
      return err;
    }else
    {
      return null;
    }
  },
  success:function(req,res){
    var succ = req.flash('success');
    if (succ.length) {
      return succ;
    }else
    {
      return null;
    }
  } 
})*/




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
  err.status = 404;*/
  res.locals.user=req.session.user;

  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;
   
  next();
});


app.use('/', routes);
app.use('/users', users);

// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/


module.exports = app;
