var express = require('express');
var router = express.Router();
var pool = require('../mysqlpool');
var auth = require('../auth');

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/auth', function (req, res, next) {
    //  Parse request.
    let userData = {
        username: req.body.username,
        password: req.body.password
    };

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        //  Query database for username, hashed password, and salt
        let queryUsername = 'SELECT username, password, salt FROM Person WHERE username = ?';
        connection.query(queryUsername, [userData.username], function (err, results) {
            if (err) throw err;

            //  If username is not found (account doesn't exist)
            if (results === undefined || results.length === 0) {
                console.log('Account doesn\'t exist.');
                //TODO: REDIRECT USER / SHOW ERROR
            } else {
                let username = results[0].username;
                let hashedPassAndSalt = results[0].password;
                let salt = results[0].salt;

                if (auth.authUser(hashedPassAndSalt, userData.password, salt)) {
                    //TODO: CREATE SESSION / REDIRECT USER
                    console.log('Password match! Logging in...');
                } else {
                    //TODO: REDIRECT USER / SHOW ERROR
                    console.log('Password does not match.');
                }
                
            }
        });
    });
    //  
});

module.exports = router;