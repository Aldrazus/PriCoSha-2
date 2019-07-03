var express = require('express');
var router = express.Router();
var pool = require('../mysqlpool');
var auth = require('../auth');

router.get('/', auth.redirectToLogin, function (req, res, next) {
    let userInfo;
    let queryUser = 'SELECT * FROM Person WHERE username = ?';
    pool.query(queryUser, [req.session.userID], (err, rows) => {
        if (err) throw err;
        userInfo = {
            firstName: rows[0].first_name.slice(),
            lastName: rows[0].last_name.slice()
        };

        res.render('home', userInfo);
    });

    
})

module.exports = router;