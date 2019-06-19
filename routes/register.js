var express = require('express');
var router = express.Router();
var pool = require('../mysqlpool');

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
        let queryExistingUser = 'SELECT * FROM Person WHERE username = ?'
        connection.query(queryExistingUser, [userData.username], function (err, results, fields) {
            if (err) throw err;
            console.log(results);
            if (results === undefined || results.length === 0) {
                console.log("This username is available.");
                let queryInsertUserData = 'INSERT INTO Person VALUES (?, ?, ?, ?)';
                connection.query(queryInsertUserData, 
                    [userData.username, userData.password, userData.firstname, userData.lastname], function (err, results, fields) {
                        if (err) throw err;
                        console.log("One entry added to Person table.");
                    });
                connection.release();
            } else {
                console.log("This username is unavailable.");
                connection.release();
            }
        });
    })
    //  If username not found, add user info to database

    //  Else, redirect/error
});

module.exports = router;