var express = require('express');
var router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

//Method GET
router.get('/', function (req, res, next) {
	Post.find({}).then(posts => {
		res.render("admin/posts", {
			posts: posts
		});
	});
});

//Method POST
router.get('/create', function (req, res, next) {
	res.render("admin/posts/create");
});
router.post('/create', function (req, res, next) {

	let allowComments = true;
	if (req.body.allowComments) {
		allowComments = true;
	} else {
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

// Method PUT
router.get('/edit/:id', function (req, res, next) {
	Post.findOne({
			_id: req.params.id
		})
		.then(post => {
			res.render("admin/posts/edit", {
				post: post
			});
		});
});
router.put('/edit/:id', (req, res) => {
	Post.findOne({
			_id: req.params.id
		})
		.then(post => {

			if (req.body.allowComments) {
				allowComments = true;
			} else {
				allowComments = false;
			}

			post.title = req.body.title;
			post.status = req.body.status;
			post.allowComments = allowComments;
			post.body = req.body.body;

			post.save().then(updatedPost=>{
				 res.redirect('/admin/posts');
			});
		});
});

//Method DELETE
router.delete('/:id', (req, res) => {
	Post.remove({_id: req.params.id})
		.then(result => {
			res.redirect('/admin/posts');
		});
});

module.exports = router;