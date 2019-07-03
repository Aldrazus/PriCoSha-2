var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  let { userID } = req.session;
  res.render('index', { userID: userID });
});

module.exports = router;