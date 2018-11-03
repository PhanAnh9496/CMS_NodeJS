var express = require('express');
var router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'home';
	next();
});
/* GET home page. */
router.get('/', function (req, res, next) {
	Post.find({})
		.then((posts) => {
			Category.find({})
				.then(categories => {
					res.render('home/index', {
						posts: posts,
						categories: categories
					});
				});
		});

});
router.get('/about', function (req, res, next) {
	res.render('home/about');
});

router.get('/login', function (req, res, next) {
	res.render('home/login');
});

//Register
router.get('/register', function (req, res, next) {
	res.render('home/register');
});
router.post('/register', function (req, res, next) {

	let errors = [];

	if (!req.body.firstName) {
		errors.push({
			message: 'Bạn chưa nhập tên!'
		});
	}

	if (!req.body.lastName) {
		errors.push({
			message: 'Bạn chưa nhập họ!'
		});
	}
	if (!req.body.email) {
		errors.push({
			message: 'Bạn chưa nhập email!'
		});
	}
	if (!req.body.password) {
		errors.push({
			message: 'Bạn chưa nhập password!'
		});
	}
	if (!req.body.passwordConfirm) {
		errors.push({
			message: 'Bạn chưa xác thực password!'
		});
	}
	if (req.body.password !== req.body.passwordConfirm) {
		errors.push({
			message: 'Xác thực lại password!!!'
		});
	}
	if (errors.length > 0) {
		res.render('home/register', {
			errors: errors
		});
	} else {

		const newUser = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password
		});

		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(newUser.password, salt, function (err, hash) {
				newUser.password = hash;
				newUser.save()
					.then(savedUser => {
						req.flash('success_message','Đăng ký thành công mời bạn Đăng Nhập');
						res.redirect('/login');
					});
			});
		});
	}
});


router.get('/post/:id', function (req, res, next) {
	Post.findOne({
			_id: req.params.id
		})
		.then(post => {
			Category.find({}).then(categories => {
				res.render('home/post', {
					post: post,
					categories: categories
				});
			});
		});

});


module.exports = router;