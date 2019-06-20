var crypto = require('crypto');

function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
};

function hashPassword(password, salt) {
    var hash = crypto.createHash('md5');
    var saltedPassword = password + salt;
    hash.update(saltedPassword);
    return hash.digest('hex');
};

function authUser(hashedPassAndSalt, password, salt) {
    var hash = crypto.createHash('md5');
    var saltedPassword = password + salt;
    hash.update(saltedPassword);
    return (hashedPassAndSalt === hash.digest('hex'));
};


exports.generateSalt = generateSalt;
exports.hashPassword = hashPassword;
exports.authUser = authUser;