var express = require('express');
var router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'home';
	next();
});
/* GET home page. */
router.get('/', function (req, res, next) {
	Post.find({})
		.then((posts) => {
			res.render('home/index', {
				posts: posts
			});
		});

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

router.get('/post/:id', function (req, res, next) {
	Post.findOne({
			_id: req.params.id
		})
		.then(post => {
			res.render('home/post', {
				post: post
			});
		});

});


module.exports = router;