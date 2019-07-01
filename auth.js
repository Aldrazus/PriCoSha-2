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

function redirectToLogin(req, res, next) {
    console.log(req.session);
    if (!req.session.userID) {
        res.redirect('/login');
    } else {
        next();
    }
}

function redirectToHome(req, res, next) {
    console.log(req.session);
    if (req.session.userID) {
        res.redirect('/home');
    } else {
        next();
    }
}


exports.generateSalt = generateSalt;
exports.hashPassword = hashPassword;
exports.authUser = authUser;
exports.redirectToLogin = redirectToLogin;
exports.redirectToHome = redirectToHome;