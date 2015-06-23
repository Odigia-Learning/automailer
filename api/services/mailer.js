var nodemailer = require('nodemailer');

module.exports = {

  send: function(user, to, subject, messageBody, callback){

    console.log('sending');


    var generator = require('xoauth2').createXOAuth2Generator({
        user: user.email,
        clientId: sails.config.secrets.google.clientId,
        clientSecret: sails.config.secrets.google.secretKey,
        refreshToken: user.googleRefreshToken,
        accessToken: user.googleToken // optional
    });

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        xoauth2: generator
      }
    });

    var email = {
        from:       user.email,
        bcc:        to,
        subject:    subject,
        html:       messageBody
      }

    transporter.sendMail(email, function(err, response){
      if(err){
        return callback(err);
      } else {
        return callback(null, response);
      }
    });

  }

};
