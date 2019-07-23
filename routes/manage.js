const express = require('express');
const router = express.Router();
const pool = require('../mysqlpool');
const auth = require('../auth');

//  TODO GET ANOTHER AUTH
//  TODO: LET ANYONE SEE THIS PAGE, NOT JUST CREATOR
//  ^ GIVE READ ONLY PRIVLEGES
//  can be done by passing a 'is_creator' bool to context

router.get('/:user-:group', auth.redirectToLogin, auth.authUserGroup, async function(req, res, next) {

    const { user, group } = req.params;

    let context = {
        username_creator: user,  //maybe replace with first & last name, looks nicer...
        group_name: group,
        members: []
    };

    const queryGroup = 'SELECT * FROM friendgroup WHERE username = ? AND group_name = ?';
    console.log(user + ' ' +  group)
    

    let rowsGroup;
    try {
        rowsGroup = await pool.queryAsync(queryGroup, [user, group]);
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
            rowsMembers = await pool.queryAsync(queryMembers, [group, user]);
        } catch(err) {
            throw new Error(err);
        }
        
        rowsMembers.forEach(row => {
            if (row.username !== user) {
                context.members.push({
                    username: row.username,
                    first_name: row.first_name,
                    last_name: row.last_name
                });
            }
        });

        res.render('manage', context);
    }

});

module.exports = router;