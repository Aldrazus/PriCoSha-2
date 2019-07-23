const express = require('express');
const router = express.Router();
const pool = require('../mysqlpool');
const auth = require('../auth');

router.get('/', auth.redirectToLogin, async function(req, res, next) {
    let context = {
        user_creator: req.session.userID,
        owned: [],
        member: []
    }
    console.log(context.user_creator);

    const queryOwnedGroups = 'SELECT * FROM friendgroup WHERE username = ?';
    let rowsOwned;
    try {
        rowsOwned = await pool.queryAsync(queryOwnedGroups, [req.session.userID]);
    } catch(err) {
        throw new Error(err);
    }

    rowsOwned.forEach(row => {
        context.owned.push({
            group_name: row.group_name,
            desc: row.description,
            link: [req.session.userID, row.group_name].join('-')
        });
    });

    const queryMemberedGroups = `
        SELECT *
        FROM friendgroup JOIN member
        ON (friendgroup.username = member.username_creator
        AND friendgroup.group_name = member.group_name)
        JOIN person
        ON (member.username_creator = person.username)
        WHERE member.username = ? AND member.username_creator != ?`;
    
    let rowsMem;
    try {
        rowsMem = await pool.queryAsync(queryMemberedGroups, [req.session.userID, req.session.userID]);
    } catch(err) {
        throw new Error(err);
    }

    rowsMem.forEach(row => {
        context.member.push({
            group_name: row.group_name,
            first_name: row.first_name,
            last_name: row.last_name,
            desc: row.description
        });
    });

    res.render('friends', context);
    


});

router.post('/auth', async function(req, res, next) {
    const { group_name, description } = req.body;
    const username = req.session.userID;
    const queryExistingGroup = 'SELECT * FROM friendgroup WHERE group_name = ? AND username = ?';

    let rows;
    try {
        rows = await pool.queryAsync(queryExistingGroup, [group_name, username]);
    } catch(err) {
        if (err) throw new Error(err);
    }

    if (rows === undefined || rows.length === 0) {
        const queryInsertGroup = 'INSERT INTO friendgroup VALUES (?, ?, ?)';
        console.log('Creating friend group...');
        let _ = await pool.queryAsync(queryInsertGroup, [group_name, username, description]);
        res.redirect('/friends');
    } else {
        //  Render page with error.
        console.log("This group already exists.");

        let context = {
            user_creator: username,
            owned: [],
            member: [],
            error: "You have already created a group with that name."
        };
    
        const queryOwnedGroups = 'SELECT * FROM friendgroup WHERE username = ?';
        let rowsOwned;
        try {
            rowsOwned = await pool.queryAsync(queryOwnedGroups, [req.session.userID]);
        } catch(err) {
            throw new Error(err);
        }
    
        rowsOwned.forEach(row => {
            context.owned.push({
                group_name: row.group_name,
                desc: row.description,
                link: [req.session.userID, row.group_name].join('-')
            });
        });
    
        const queryMemberedGroups = `
            SELECT *
            FROM friendgroup JOIN member
            ON (friendgroup.username = member.username_creator
            AND friendgroup.group_name = member.group_name)
            JOIN person
            ON (member.username_creator = person.username)
            WHERE member.username = ? AND member.username_creator != ?`;
        
        let rowsMem;
        try {
            rowsMem = await pool.queryAsync(queryMemberedGroups, [req.session.userID, req.session.userID]);
        } catch(err) {
            throw new Error(err);
        }
    
        rowsMem.forEach(row => {
            context.member.push({
                group_name: row.group_name,
                first_name: row.first_name,
                last_name: row.last_name,
                desc: row.description
            });
        });
    
        res.render('friends', context);
        
    }

});

module.exports = router;