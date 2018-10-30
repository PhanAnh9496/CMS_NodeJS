var express = require('express');
var router = express.Router();

router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'home';
	next();
});
/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('home/index');
});
router.get('/about', function (req, res, next) {
	res.render('home/about');
});

router.get('/login', function (req, res, next) {
	res.render('home/login');
});

router.get('/register', function (req, res, next) {
	res.render('home/register');
});

module.exports = router;