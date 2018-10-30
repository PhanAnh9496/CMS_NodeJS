var express = require('express');
var router = express.Router();

router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', function (req, res, next) {
	res.render('admin/index');
});

module.exports = router;