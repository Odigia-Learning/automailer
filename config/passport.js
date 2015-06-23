var passport      = require('passport'),
    GoogleStrategy = require('passport-google-auth').Strategy;

module.exports = {

 http: {
    customMiddleware: function(app){
      console.log('express midleware for passport');
      app.use(passport.initialize());
      app.use(passport.session());
    }
  }

};
