var express = require('express');
var router = express.Router();
var faker = require('Faker');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Category = require('../../models/Category');
const {
	userAuthenticated
} = require('../../helpers/authentication');

//add userAuthenticated
router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', function (req, res, next) {

	const promises = [
		Post.count().exec(),
		Category.count().exec(),
		Comment.count().exec(),
	];

	Promise.all(promises)
		.then(([postCount, categoryCount, commentCount]) => {
			res.render('admin/index', {
				postCount: postCount,
				categoryCount: categoryCount,
				commentCount: commentCount
			});
		});
});

router.post('/generate-fake-posts', (req, res) => {
	for (let i = 0; i < req.body.amount; i++) {
		var post = new Post();
		post.title = faker.Lorem.sentence();
		post.status = 'public';
		post.slug = faker.Lorem.sentence();
		post.allowComments = true;
		post.body = faker.Lorem.paragraphs();

		post.save(function (err) {
			if (err) throw err;
		});

	}
	res.redirect('/admin/posts');
});

module.exports = router;