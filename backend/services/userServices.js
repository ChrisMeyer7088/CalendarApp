function validatePassword(password) {
    if(typeof password !== 'string' || password.length < 8) return false;
    if(!(/\d/.test(password) && /[A-Z]/.test(password))) return false;
    return true;
}

function checkIfUserExists(username) {
    
}

module.exports = {
    validatePassword
}