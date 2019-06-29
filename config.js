const ONE_HOUR = 1000 * 60 * 60;
const SESS_SECRET = 'reZMgTnJVYhmuooruzPv7ux26SM=';

var config = {};

config.pool = {
    host: 'localhost',
    user: 'root',
    password: '45PwTLVTaMx9ycZQ',
    database: 'pricosha',
    connectionLimit: 10
};

config.session = {
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: ONE_HOUR,
        sameSite: true,
        secure: false   //CHANGE TO TRUE IN PRODUCTION
    }
}

module.exports = config;