const express = require('express');
const router = express.Router();
const pool = require('../mysqlpool');
const auth = require('../auth');

router.get('/', auth.redirectToLogin, async function (req, res, next) {
    
    /*
    let context = {
        userInfo: {
            firstName,
            lastName
        },
        posts: []
    };
    */

    let userInfo;

    let queryUser = 'SELECT * FROM Person WHERE username = ?';
    let rows;
    try {
        rows = await pool.queryAsync(queryUser, [req.session.userID]);
    } catch(err) {
        throw new Error(err);
    }
    
    console.log(rows);
    userInfo = {
        firstName: rows[0].first_name.slice(),
        lastName: rows[0].last_name.slice()
    };

    //  GET POSTS
    let queryPost = 'SELECT * FROM content WHERE public = 1'
    res.render('home', userInfo);
    
})

module.exports = router;