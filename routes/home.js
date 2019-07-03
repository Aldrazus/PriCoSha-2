var express = require('express');
var router = express.Router();
var pool = require('../mysqlpool');
var auth = require('../auth');

router.get('/', auth.redirectToLogin, async function (req, res, next) {
    try {
        console.log(req.session.userID);
        let queryUser = 'SELECT * FROM Person WHERE username = ?';
        var rows = await pool.query(queryUser, [req.session.userID]);
        console.log(rows);
        let userInfo = {
            firstName: rows[0].first_name,
            lastName: rows[0].last_name
        };
        res.render('home', userInfo);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = router;