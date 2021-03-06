var express = require('express');
var router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'home';
	next();
});
/* GET home page. */
router.get('/', function (req, res, next) {

	const perPage = 8;
	const page = req.query.page || 1;

	Post.find({})
		.skip((perPage * page) - perPage)
		.limit(perPage)
		.then((posts) => {
			Post.count()
				.then(postCount => {
					Category.find({})
						.then(categories => {
							res.render('home/index', {
								posts: posts,
								categories: categories,
								current: parseInt(page),
								pages: Math.ceil(postCount/perPage)
							});
						});
				});

		});

});
router.get('/about', function (req, res, next) {
	res.render('home/about');
});

//Login
router.get('/login', function (req, res, next) {
	res.render('home/login');
});

passport.use(new LocalStrategy({
		usernameField: 'email'
	},
	(email, password, done) => {
		User.findOne({
				email: email
			})
			.then(user => {
				if (!user) {
					return done(null, false, {
						message: 'Tai khoan khong ton tai'
					});
				}
				bcrypt.compare(password, user.password, (err, matched) => {
					if (err) {
						return err;
					}
					if (matched) {
						return done(null, user);
					} else {
						return done(null, false, {
							message: 'Sai password.'
						});
					}
				});
			});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});


router.post('/login', function (req, res, next) {
	passport.authenticate('local', {
		successRedirect: '/admin',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
});

//Log-out
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/login');
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
			errors: errors,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email
		});
	} else {

		User.findOne({
				email: req.body.email
			})
			.then(user => {
				if (!user) {
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
									req.flash('success_message', 'Đăng ký thành công mời bạn Đăng Nhập');
									res.redirect('/login');
								});
						});
					});
				} else {
					req.flash('error_message', 'Email đã tồn tại vui lòng đăng nhập!');
					res.redirect('/login');
				}
			});
	}
});

//Detail Post
router.get('/post/:slug', function (req, res, next) {
	Post.findOne({
			slug: req.params.slug
		})
		.populate({
			path: 'comments',
			match: {
				approveComment: true
			},
			populate: {
				path: 'user',
				model: 'users'
			}
		})
		.populate('user')
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