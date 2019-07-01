var express = require('express');
var router = express.Router();
var pool = require('../mysqlpool');
var auth = require('../auth');
var { check, validationResult } = require('express-validator');

router.get('/', auth.redirectToHome, function (req, res, next) {
    res.render('register');
});

router.post('/auth', function (req, res, next) {
    //  Parse request
    let { username, password, firstname, lastname } = req.body;

    //  Check database for existing username
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        let queryExistingUser = 'SELECT * FROM Person WHERE username = ?'
        connection.query(queryExistingUser, [username], function (err, results, fields) {
            if (err) throw err;
            //  If username not found (username available)
            if (results === undefined || results.length === 0) {
                console.log("This username is available.");

                //  Generate salt and hashed password
                let salt = auth.generateSalt();
                let hashedPass = auth.hashPassword(password, salt);

                //  Insert user info into database
                let queryInsertUserData = 'INSERT INTO Person VALUES (?, ?, ?, ?, ?)';
                connection.query(queryInsertUserData, [username, hashedPass, firstname, lastname, salt], function (err, results, fields) {
                    if (err) throw err;
                    console.log("One entry added to Person table.");
                });
                //TODO: CREATE SESSION & REDIRECT USER
                connection.release();
                //  Maybe use uuid?
                //  User ID is just the username right now.
                //  Add field to sessions table with foreign key to Persons
                req.session.userID = username;

                //  Need to save session when redirecting, see login
                req.session.save(err => {
                    redirect('/home');
                })

            //  Username is found (username not available)
            } else {
                console.log("This username is unavailable.");
                //TODO: REDIRECT USER
                connection.release();
            }
        });

        res.redirect('/home');
    })
});

module.exports = router;