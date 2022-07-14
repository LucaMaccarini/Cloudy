const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
   host: 'smtp.zoho.eu',
   port: 465,
   secure: true,
   auth: {
           user:'iodbsdfhsrhn@zohomail.eu',
           pass:'PasswordPerEsame1#'
   }
});

exports.sendMail = function(mailOptions){

    return new Promise(function (resolve, reject){
       transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
             console.log("error: ", err);
             reject(err);
          } else {
             resolve(info);
          }
       });
    });
 
 }
