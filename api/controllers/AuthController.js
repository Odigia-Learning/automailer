/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');

module.exports = {

	google: function(req, res){

    passport.authenticate('google', { failureRedirect: '/failed' }, function(err, user, info){

      if ((err) || (!user)) {

        req.flash("message", '<div class="alert alert-danger">Your Email Address or Password is Wrong 42</div>');

        res.cookie("message", {message: "Your Email Address or Password is Wrong", type: "error", options: {}});
        res.redirect("/");
        return;

      } else {

        req.logIn(user, function(err){
          if (err) {
            res.send(err);
            res.send(500, err);
          } else {

						req.flash("message", '<div class="alert alert-danger">Success</div>');

						res.cookie("message", {message: "Success", type: "error", options: {}});
						res.redirect("/dashboard");
						return;

          }

        });

      }

    })(req, res);
  }


};
