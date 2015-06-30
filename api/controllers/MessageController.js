/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var csv = require('csv-to-json');

module.exports = {

	create: function(req, res){

		var params = req.params.all();

		Message.create(params, function(err, message){

			if(err){
				req.flash("message", '<div class="alert alert-danger">Error in Message Creation</div>');
				return res.redirect("/dashboard");
			}

			if(message){

				var addresses = params.addresses;

				addresses = addresses.trim()
				addresses = addresses.replace(/\s/g,'');
				addresses = addresses.split(',');

				console.log(addresses);

				mailer.send(req.user, addresses, params.subject, params.message, function(err, sent){
					if(err){
						console.log(err);
						req.flash("message", '<div class="alert alert-danger">Error in Message Creation</div>');
						return res.redirect("/dashboard");
					}
					if(sent){
						req.flash("message", '<div class="alert alert-success">Message Sent</div>');
						return res.redirect("/dashboard");
					}
				});

			}

		});

	},

	groupSend: function(req, res){

		var params = req.params.all();

		req.file('csv').upload(function (err, uploadedFiles){
  		if (err){
				return res.badRequest(err);
			}
			if(uploadedFiles){

				var obj = {
					filename: uploadedFiles[0].fd
				};

				csv.parse(obj, function(err, json){
					if(err){

						return res.badRequest(err);
					}
					if(json){

						async.eachSeries(json, function(item, asyncCB){

							var entry = {
								firstName: item['FIRST NAME'],
								lastName: item['LAST NAME'],
								school: item['SCHOOL'],
								dept: item['DEPARTMENT'],
								state: item['NC'],
								email: item['EMAIL'],
								title: item['TITLE'],
								phone: item['PHONE'],
								message: params.message,
								fromName: params.fromName,
								fromPhone: params.fromPhone,
								fromEmail: req.user.email,
								pageUrl: params.pageUrl
							};

							res.render('emails/mail.ejs', entry, function(err, emailBody){
								if(err){
									asyncCB();
								}
								if(emailBody){
									mailer.send(req.user, entry.email, params.subject, emailBody, function(err, done){
										if(err){

											asyncCB();
										}
										if(done){

											asyncCB();

										}
									});
								}

							});



							// res.render('emails/main.ejs', {data: entry}, function(err, emailBody){
							// 	if(err){
							// 		console.log(err);
							// 		asyncCB();
							// 	}
							// 	if(emailBody){
							// 		mailer.send(req.user, entry.email, 'Test Email Subject', emailBody, function(err, done){
							// 			if(err){
							//
							// 				console.log(err);
							// 				asyncCB();
							// 			}
							// 			if(done){
							// 				console.log(done);
							// 				asyncCB();
							//
							// 			}
							// 		});
							// 	}
							// });


						}, function(err){
							req.flash("message", '<div class="alert alert-success">Message Sent</div>');
							return res.redirect("/dashboard");
						});


					}
				});


			}

		});



	}

};
