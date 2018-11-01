var express = require('express');
var router = express.Router();
const Post = require('../../models/Post');
const {
	isEmpty,
	uploadDir
} = require('../../helpers/upload-helpers');

const fs = require('fs');

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
			title: req.body.title,
			status: req.body.status,
			allowComments: allowComments,
			body: req.body.body,
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
			let filename = '.jpg';
			if (!isEmpty(req.files)) {
				console.log('is not empty');
				let file = req.files.file;
				filename = Date.now() + filename;
				post.file = filename;
				file.mv('./public/uploads/' + filename, (err) => {
					if (err) throw err;
				});
			}

			post.save().then(updatedPost => {
				req.flash('success_message', 'Bài viết đã được sửa');
				res.redirect('/admin/posts');
			});
		});
});

//Method DELETE
router.delete('/:id', (req, res) => {
	Post.findOne({
			_id: req.params.id
		})
		.then(post => {
			req.flash('success_message', 'Bài viết đã xóa');
			fs.unlink(uploadDir + post.file, (err) => {
				post.remove();
				res.redirect('/admin/posts');
			});

		});
});

module.exports = router;