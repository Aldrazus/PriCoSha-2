const express = require('express');
const router = express.Router();
const auth = require('../auth');

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