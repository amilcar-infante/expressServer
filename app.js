var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

var chokidar = require('chokidar');

var watcher = chokidar.watch('./public/images/', {
  ignored: /node_modules|\.git/,
  persistent: true
})

var log = console.log.bind(console);

watcher
  .on('add', function(path) { log('File', path, 'has been added'); })
  .on('addDir', function(path) { log('Directory', path, 'has been added'); })
  .on('change', function(path) { log('File', path, 'has been changed'); })
  .on('unlink', function(path) { log('File', path, 'has been removed'); })
  .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
  .on('error', function(error) { log('Error happened', error); })
  .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
  .on('raw', function(event, path, details) { log('Raw event info:', event, path, details);
    if (event === 'modified') {
        printFile(path, 'HP_Deskjet_3050_J610_series');
    }
})

// Only needed if watching is `persistent: true`.
//watcher.close();

var printer = require("printer");
console.log('platform:', process.platform);
console.log('printer list', printer.getPrinters());

var printFile = function(filename, printerName) {
    if( process.platform != 'win32') {
      printer.printFile({filename:filename,
        printer: printerName, // printer name, if missing then will print to default printer
        success:function(jobID){
          console.log("sent to printer with ID: "+jobID);
        },
        error:function(err){
          console.log(err);
        }
      });
    } else {
      // not yet implemented, use printDirect and text
      var fs = require('fs-express');
      printer.printDirect({data:fs.readFileSync(filename),
        printer: printerName, // printer name, if missing then will print to default printer
        success:function(jobID){
          console.log("sent to printer with ID: "+jobID);
        },
        error:function(err){
          console.log(err);
        }
      });
    }
}

module.exports = app;
