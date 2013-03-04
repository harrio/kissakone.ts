
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , gpio = require("./routes/gpio")
  , api = require("./routes/api");

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.post('/gpioOn', gpio.gpioOn);
app.post('/gpioOff', gpio.gpioOff);

app.get('/api/runs', api.findAll);
app.get('/api/run/:id', api.findById);
app.post('/api/run', api.addRun);
app.put('/api/run/:id', api.updateRun);
app.delete('/api/run/:id', api.deleteRun);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
