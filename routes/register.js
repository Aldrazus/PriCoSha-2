var express = require('express');
var router = express.Router();
var pool = require('../mysqlpool');
var auth = require('../auth');

router.get('/', function (req, res, next) {
    res.render('register');
});



router.post('/auth', function (req, res, next) {
    //  Parse request
    let userData = {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };

    console.log(req.body);

    //  Check database for existing username
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        let queryExistingUser = 'SELECT * FROM Person WHERE username = ?'
        connection.query(queryExistingUser, [userData.username], function (err, results, fields) {
            if (err) throw err;
            //  If username not found (username available)
            if (results === undefined || results.length === 0) {
                console.log("This username is available.");

                //  Generate salt and hashed password
                let salt = auth.generateSalt();
                let hashedPass = auth.hashPassword(userData.password, salt);

                //  Insert user info into database
                let queryInsertUserData = 'INSERT INTO Person VALUES (?, ?, ?, ?, ?)';
                connection.query(queryInsertUserData, [userData.username, hashedPass, userData.firstname, userData.lastname, salt], function (err, results, fields) {
                    if (err) throw err;
                    console.log("One entry added to Person table.");
                });
                //TODO: CREATE SESSION & REDIRECT USER
                connection.release();

            //  Username is found (username not available)
            } else {
                console.log("This username is unavailable.");
                //TODO: REDIRECT USER
                connection.release();
            }
        });
    })
});

module.exports = router;