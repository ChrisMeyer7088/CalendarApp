const nodemailer = require('nodemailer');
const { password } = require('../ignoreFolder/sensitiveFile');

function validatePassword(password) {
    if(typeof password !== 'string' || password.length < 8) return false;
    if(!(/\d/.test(password) && /[A-Z]/.test(password))) return false;
    return true;
}

function validateEmail(email) {
    if(email.includes('@')) {
        let emailArr = email.split('@');
        let emailName = emailArr[0];
        let emailSuffix = emailArr[1];
        if(emailName.length > 0 && emailSuffix.includes('.com')) {
            let emailHost = emailSuffix.split('.com');
            if(emailHost[0].length > 0) return true;
        }
    }
    return false;
}

function sendMail(recieverAddress, subject, body){
    return new Promise((resolve, reject) => {
        let userName = 'chrismailbot@gmail.com'
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: userName,
              pass: password
            }
        });
        let mailOptions = {
        from: userName,
        to: recieverAddress,
        subject: subject,
        text: body
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return reject(false)
            } else {
                return resolve(true)
            }
        });
    })
}

module.exports = {
    validatePassword,
    validateEmail,
    sendMail
}