const express = require('express');
const router = express.Router();
const pool = require('../mysqlpool');
const auth = require('../auth');

//  TODO GET ANOTHER AUTH
//  TODO: LET ANYONE SEE THIS PAGE, NOT JUST CREATOR
//  ^ GIVE READ ONLY PRIVLEGES
//  can be done by passing a 'is_creator' bool to context

router.get('/:owner-:group', auth.redirectToLogin, auth.authUserGroup, async function(req, res, next) {

    const { owner, group } = req.params;

    let context = {
        username_creator: owner,  //maybe replace with first & last name, looks nicer...
        group_name: group,
        members: [],
        add_link: '/manage/' + owner + '-' + group + '/add'
    };

    const queryGroup = 'SELECT * FROM friendgroup WHERE username = ? AND group_name = ?';
    console.log(owner + ' ' +  group)
    

    let rowsGroup;
    try {
        rowsGroup = await pool.queryAsync(queryGroup, [owner, group]);
    } catch(err) {
        throw new Error(err);
    }

    console.log(rowsGroup);
    if (rowsGroup === undefined || rowsGroup.length === 0) {
        res.redirect('/friends');
    } else {
        context.desc = rowsGroup[0].description;

        const queryMembers = 'SELECT * FROM member NATURAL JOIN person WHERE group_name = ? AND username_creator = ?';
        let rowsMembers;
        try {
            rowsMembers = await pool.queryAsync(queryMembers, [group, owner]);
        } catch(err) {
            throw new Error(err);
        }
        
        rowsMembers.forEach(row => {
            if (row.username !== owner) {
                context.members.push({
                    username: row.username,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    unfriend_link: '/manage/' + owner + '-' + group + '/del-' + row.username
                });
            }
        });

        res.render('manage', context);
    }

});

router.post('/:owner-:group/add', auth.redirectToLogin, auth.authUserGroup, async function(req, res, next) {
    console.log('adding!!!!');
    const { owner, group } = req.params;
    const { username } = req.body;
    
    // is the user already in this group? does the user even exist?
    const queryExistingMember = `
    SELECT * FROM person 
    WHERE username = ? 
    AND NOT EXISTS (
    SELECT * FROM member 
    WHERE username = ?
    AND group_name = ?
    AND username_creator = ?
    )`

    let rowsMembers;

    try {
        rowsMembers = await pool.queryAsync(queryExistingMember, [username, username, group, owner]);
    } catch(err) {
        throw new Error(err);
    }

    if (rowsMembers === undefined || rowsMembers.length === 0) {
        const error = 'Please select an existing user not in this friend group.'
        console.log(error);
        res.redirect('/manage/' + owner + '-' + group); //CHANGE THIS TO SHOW ERROR
        
    } else {
        const queryAddMember = 'INSERT INTO member VALUES (?, ?, ?)';
        let _ = await pool.queryAsync(queryAddMember, [username, group, owner]);
        res.redirect('/manage/' + owner + '-' + group);

    }
});

router.get('/:owner-:group/del-:friend', auth.redirectToLogin, auth.authUserGroup, async function(req, res, next) {
    const { owner, group, friend } = req.params;

    const queryRemoveFriend = 'DELETE FROM member WHERE username = ? AND group_name = ? AND username_creator = ?';
    try {
        let _ = await pool.queryAsync(queryRemoveFriend, [friend, group, owner]);
    } catch (error) {
        throw new Error(err);
    }
    res.redirect('/manage/' + owner + '-' + group);
});

module.exports = router;