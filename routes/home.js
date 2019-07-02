var express = require('express');
var router = express.Router();
var pool = require('../mysqlpool');
var auth = require('../auth');
var cloneDeep = require('lodash/fp/cloneDeep');

router.get('/', auth.redirectToLogin, async function (req, res, next) {
    let queryUser = 'SELECT * FROM Person WHERE username = ?';
    var rows = await pool.query(queryUser, [req.session.userID]);
    let userInfo = {
        firstName: rows[0].first_name,
        lastName: rows[0].last_name
    };
    res.render('home', userInfo);
})

module.exports = router;