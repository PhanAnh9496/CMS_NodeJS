var express = require('express');
var router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', function (req, res, next) {
	Post.find({}).then(posts => {
		res.render("admin/posts",{posts:posts});
	});
});
router.get('/create', function (req, res, next) {
	res.render("admin/posts/create");
});
router.post('/create', function (req, res, next) {

	let allowComments = true;
	if(req.body.allowComments)
	{
		allowComments = true;
	}
	else
	{
		allowComments = false;
	}

	const newPost = new Post({
		title: req.body.title,
		status: req.body.status,
		allowComments: allowComments,
		body: req.body.body
	});
	newPost.save()
			.then(savedPost => {
				console.log(savedPost);
				res.redirect('/admin/posts');
			})
			.catch(error => {
				console.log("Could not saved");
			});
	// console.log(req.body.allowComments);
});

router.get('/edit/:id', function (req, res, next) {
	Post.findOne({_id:req.params.id}).then(post => {
		res.render("admin/posts/edit",{post:post});
	});
	// res.render("admin/posts/edit");
});

module.exports = router;