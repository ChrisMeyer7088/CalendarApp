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

module.exports = {
    validatePassword,
    validateEmail
}