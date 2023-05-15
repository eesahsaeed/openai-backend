
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var logger = require('morgan');
const cron = require("node-cron");
var Imap = require('node-imap')
var inspect = require('util').inspect;

require("dotenv").config({path: "./.env"});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var campaignRouter = require("./routes/campaign");
var testRouter = require("./routes/test");

const notifier = require('mail-notifier');
 
const imap = {
  user: "isahsaidu418@gmail.com",
  password: "aicnprjocbutozjg",
  host: "imap.gmail.com",
  port: 993, // imap port
  tls: true,// use secure connection
  tlsOptions: { rejectUnauthorized: false }
};

/*
const n = notifier(imap);
n.on('end', () => n.start()) // session closed
  .on('mail', mail => console.log(mail.from[0].address, mail.subject))
  .start();*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

/*             
cron.schedule("15 * * * * *", function () {
  console.log("---------------------");
  console.log("running a task every 15 seconds");
});
*/


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/campaign", campaignRouter);
app.use("/test", testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT, () => {
  console.log("Server listening on port 4000");
})
