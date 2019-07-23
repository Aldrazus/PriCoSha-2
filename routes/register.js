var express = require('express');
var router = express.Router();
var pool = require('../mysqlpool');
var auth = require('../auth');
var { check, validationResult } = require('express-validator');

router.get('/', auth.redirectToHome, function (req, res, next) {
    res.render('register');
});

router.post('/auth', async function (req, res, next) {
    //  Parse request
    let { username, password, firstname, lastname } = req.body;

    //  Check database for existing username
    let queryExistingUser = 'SELECT * FROM Person WHERE username = ?';
    let rows = await pool.queryAsync(queryExistingUser, [username]);

    if (rows === undefined || rows.length === 0) {
        console.log("This username is available.");
        //  Generate salt and hashed password
        let salt = auth.generateSalt();
        let hashedPass = auth.hashPassword(password, salt);
        //  Insert user info into database
        let queryInsertUserData = 'INSERT INTO Person VALUES (?, ?, ?, ?, ?)';
        let _ = await pool.queryAsync(queryInsertUserData, [username, hashedPass, firstname, lastname, salt]);

        //  Maybe use uuid?
        //  User ID is just the username right now.
        //  Add field to sessions table with foreign key to Persons
        req.session.userID = username;

        //  Need to save session when redirecting, see login
        req.session.save(err => {
            res.redirect('/home');
        });
    

    //  Username is found (username not available)
    } else {
        console.log('This username is unavailable.');
        //  TODO: Redirect user/display error.
        res.redirect('/register');
    }



    
    
});

module.exports = router;