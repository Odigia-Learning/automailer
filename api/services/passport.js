var passport = require('passport'),
    GoogleStrategy = require('passport-google-auth').Strategy;


// helper functions
function findById(id, fn) {
  User.findOne(id).exec( function(err, user){
    if (err){
      return fn(null, null);
    }else{
      return fn(null, user);
    }
  });
}

function findByUsername(u, fn) {
  User.findOne({
    username: u,
    activated: true
  }).exec(function(err, user) {
    // Error handling
    if (err) {
      return fn(null, null);
    // The User was found successfully!
    }else{
      return fn(null, user);
    }
  });
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientId: sails.config.secrets.google.clientId,
  clientSecret: sails.config.secrets.google.secretKey,
  callbackURL: sails.config.secrets.base.url + '/auth/google',
  scope: ['email','profile', 'https://mail.google.com/'],
  accessType: 'offline',
  approval_prompt: true
}, function(accessToken, refreshToken, properties, done) {
  console.log(accessToken);
  console.log(refreshToken);
  console.log(properties);

  User.findOne({googleId: properties.id}, function(err, user){
    if(err){
      return done(err);
    }
    if(user){
      return done(null, user);
    } else {
      User.create({googleId: properties.id, googleToken: accessToken, googleRefreshToken: refreshToken, email: properties.emails[0].value, properties: properties}, function(err, newUser){
        if(err){
          return done(err);
        }
        if(newUser){
          return done(null, newUser);
        }
      });
    }

  });
}));

/**
 * Login Required middleware.
 */

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */

exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];
  if (_.findWhere(req.user.tokens, { kind: provider })) next();
  else res.redirect('/auth/' + provider);
};
