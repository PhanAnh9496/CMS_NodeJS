var express = require('express');
var router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {
	isEmpty,
	uploadDir
} = require('../../helpers/upload-helpers');
const {
	userAuthenticated
} = require('../../helpers/authentication');
const fs = require('fs');

//add userAuthenticated
router.all('/*', (req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

//Method GET
router.get('/', function (req, res, next) {
	Post.find({})
		.populate('category')
		.then(posts => {
			res.render("admin/posts", {
				posts: posts
			});
		});
});

router.get('/my-posts', (req,res) => {
	Post.find({user:req.user.id})
		.populate('category')
		.then(posts => {
			res.render("admin/posts/my-posts", {
				posts: posts
			});
		});
});

//Method POST
router.get('/create', function (req, res, next) {

	Category.find({})
		.then(categories => {
			res.render("admin/posts/create", {
				categories: categories
			});
		});


});
router.post('/create', function (req, res, next) {

	let errors = [];

	if (!req.body.title) {
		errors.push({
			message: 'Nhap tieu de!!!'
		});
	}

	if (!req.body.status) {
		errors.push({
			message: 'Chon trang thai!!!'
		});
	}
	if (!req.body.body) {
		errors.push({
			message: 'Nhap noi dung!!!'
		});
	}
	if (errors.length > 0) {
		res.render('admin/posts/create', {
			errors: errors
		});
	} else {
		let filename = '.jpg';

		if (!isEmpty(req.files)) {
			let file = req.files.file;
			filename = Date.now() + filename;
			file.mv('./public/uploads/' + filename, (err) => {
				if (err) throw err;
			});
		}

		let allowComments = true;
		if (req.body.allowComments) {
			allowComments = true;
		} else {
			allowComments = false;
		}

		const newPost = new Post({
			user:req.user.id,
			title: req.body.title,
			status: req.body.status,
			allowComments: allowComments,
			body: req.body.body,
			category: req.body.category,
			file: filename
		});
		newPost.save()
			.then(savedPost => {
				req.flash('success_message', `Bài viế́t ${savedPost.title} đã được tạo.`);
				res.redirect('/admin/posts');
			})
			.catch(error => {
				console.log(error, "Could not saved");
			});
	}



});

// Method PUT
router.get('/edit/:id', function (req, res, next) {
	Post.findOne({
			_id: req.params.id
		})
		.then(post => {

			Category.find({})
				.then(categories => {
					res.render("admin/posts/edit", {
						post: post,
						categories: categories
					});
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

			post.user = req.user.id;
			post.title = req.body.title;
			post.status = req.body.status;
			post.allowComments = allowComments;
			post.body = req.body.body;
			post.category = req.body.category;
			let filename = '.jpg';
			if (!isEmpty(req.files)) {
				let file = req.files.file;
				filename = Date.now() + filename;
				post.file = filename;
				file.mv('./public/uploads/' + filename, (err) => {
					if (err) throw err;
				});
			}

			post.save().then(updatedPost => {
				req.flash('success_message', 'Bài viết đã được sửa');
				res.redirect('/admin/posts/my-posts');
			});
		});
});

//Method DELETE
router.delete('/:id', (req, res) => {
	Post.findOne({
			_id: req.params.id
		})
		.populate('comments')
		.then(post => {
			fs.unlink(uploadDir + post.file, (err) => {
				if (!post.comments.length < 1) {
					post.comments.forEach(comment => {
						comment.remove();
					});
				}
				post.remove()
					.then(postRemoved => {
						req.flash('success_message', 'Bài viết đã xóa');
						res.redirect('/admin/posts/my-posts');
					});
			});

		});
});

module.exports = router;