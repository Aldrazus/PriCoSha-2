var express = require('express');
var router = express.Router();
var pool = require('../mysqlpool');
var auth = require('../auth');

router.get('/', auth.redirectToLogin, function (req, res, next) {
    let userInfo;
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        let queryUser = 'SELECT * FROM Person WHERE username = ?';
        connection.query(queryUser, [req.session.userID], function (err, results, fields) {
            if (err) throw err;
            userInfo = {
                firstName: results[0].first_name,
                lastName: results[0].last_name
            }
            connection.release();
            res.render('home', userInfo);
        });
    });
})

module.exports = router;