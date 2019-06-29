var express = require('express');
var router = express.Router();
var auth = require('../auth');

router.get('/', auth.redirectToLogin, function (req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
    });

    res.clearCookie('connect.sid'); //  default name of session ID cookie
    res.redirect('/login');
})

module.exports = router;