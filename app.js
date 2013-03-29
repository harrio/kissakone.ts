
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , everyauth = require('everyauth')
  , http = require('http')
  , path = require('path')
  , gpio = require("./services/gpio")
  , api = require("./routes/api")
//  , gallery = require('node-gallery/gallery')
  , rundb = require("./services/rundb");

var everyauthRoot = __dirname + '/..';

everyauth.debug = true;

var usersById = {};
var nextUserId = 0;

var usersByLogin = {
  'morko': addUser({ login: 'morko', password: 'RaisuJaNirppu'})
};

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

everyauth.everymodule.handleLogout( function (req, res) {
  req.logout(); 
  console.log("Logged out");
  this.redirect(res, this.logoutRedirectPath());
});

function preEveryauthMiddlewareHack() {
    return function (req, res, next) {
      var sess = req.session
        , auth = sess.auth
        , ea = { loggedIn: !!(auth && auth.loggedIn) };

      // Copy the session.auth properties over
      for (var k in auth) {
        ea[k] = auth[k];
      }

      if (everyauth.enabled.password) {
        // Add in access to loginFormFieldName() + passwordFormFieldName()
        ea.password || (ea.password = {});
        ea.password.loginFormFieldName = everyauth.password.loginFormFieldName();
        ea.password.passwordFormFieldName = everyauth.password.passwordFormFieldName();
      }

      res.locals.everyauth = ea;

      next();
    }
};

function postEveryauthMiddlewareHack() {
  var userAlias = everyauth.expressHelperUserAlias || 'user';
  return function( req, res, next) {
    res.locals.everyauth.user = req.user;
    res.locals[userAlias] = req.user;
    next();
  };
};

var app = express();

everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
    .loginLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async login'
        });
      }, 200);
    })
    .authenticate( function (login, password) {
      var errors = [];
      if (!login) errors.push('Missing login');
      if (!password) errors.push('Missing password');
      if (errors.length) return errors;
      var user = usersByLogin[login];
      if (!user) return ['Login failed'];
      if (user.password !== password) return ['Login failed'];
      return user;
    })
    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerUser( function (newUserAttrs) {
      return false;
    })
    .loginSuccessRedirect('/');


app.configure(function() {
  app.use(express.logger());
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'foobar' }));
  app.use(express.bodyParser());
  app.use(preEveryauthMiddlewareHack());
  app.use(everyauth.middleware(app));
  app.use(postEveryauthMiddlewareHack());
  app.use(express.methodOverride()); // delete & put
  //app.use(gallery.middleware({static: 'photos', directory: '.', rootURL: "/gallery"}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  //app.use('/gallery', express.static(path.join(__dirname, 'photos')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.post('/gpioOn', api.resetCycle);
app.post('/rumble', api.rumble);
app.post('/gpioOff', api.gpioOff);

app.get('/api/runs', api.findAll);
app.get('/api/runsDone', api.findAllDone);
app.get('/api/run/:id', api.findById);
app.post('/api/run', api.addRun);
app.put('/api/run/:id', api.updateRun);
app.delete('/api/run/:id', api.deleteRun);

//app.get('/gallery*', function(req, res){
  // We automatically have the gallery data available to us in req thanks to middleware
  //var data = req.gallery;
  // and we can res.render using one of the supplied templates (photo.ejs/album.ejs) or one of our own
  //res.render(data.type + '.jade', data);
//});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

setInterval(function() {
    rundb.findBeforeDate(new Date(), function(err, items) {
        console.log(items);
        if (items !== null) {
            for (var i = 0; i < items.length; i++) {
                var run = items[i];
                run.done = true;
                rundb.updateRun(run._id.toString(), run, function() {
                    console.log("Marked " + run._id + " as done.");
                    console.log("Start run...");
                    
                    gpio.registerListener(function(val) {
                        console.log("Switch off: " + val);
                        if (val == 1) {
                            gpio.gpioOff();
                            gpio.unregisterListener();

                            gpio.rumbleOn();
                            setTimeout(function() {
                                console.log("Rumble");
                                gpio.rumbleOff();
                            }, 4000);
                        }
                    });

                    gpio.gpioOn();
                    setTimeout(function() {
                        console.log("Timeout");
                        gpio.gpioOff();
                        gpio.unregisterListener();  
                    }, 5000);
                });
            }
        }
    });
}, 10000);