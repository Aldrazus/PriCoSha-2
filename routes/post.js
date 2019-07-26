const express = require('express');
const router = express.Router();
const pool = require('../mysqlpool');
const auth = require('../auth');

router.get('/', auth.redirectToLogin, async function(req, res, next) {
    let context = {
        posts: []
    };

    const queryPosts = 'SELECT * FROM content WHERE username = ?';
    let rows;
    try {
        rows = await pool.queryAsync(queryPosts, [req.session.userID])
    } catch(err) {
        throw new Error(err);
    }

    rows.forEach(row => {
        context.posts.push({
            user: row.username,
            timest: row.timest,
            file_path: row.file_path,
            content_name: row.content_name,
            link: '/posts/' + row.id
        });
    });

    res.render('post', context);

    
});

router.post('/auth', auth.redirectToLogin, async function(req, res, next) {

    let { file_path, content_name, public } = req.body;

    if (public === 'public') {
        public = 1;
    } else {
        public = 0;
    }

    username = req.session.userID;

    const queryPostContent = `
    INSERT INTO content (username, timest, file_path, content_name, public) 
    VALUES (?, CURRENT_TIMESTAMP(), ?, ?, ?)
    `
    try {
        let _ = await pool.queryAsync(queryPostContent, [username, file_path, content_name, public]);
    } catch(err) {
        throw new Error(err);
    }

    res.redirect('/post');
});

module.exports = router;
