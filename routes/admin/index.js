var express = require('express');
var router = express.Router();
var faker = require('Faker');
const Post = require('../../models/Post');
const {userAuthenticated} = require('../../helpers/authentication');

//add userAuthenticated
router.all('/*' ,(req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

router.get('/', function (req, res, next) {
	res.render('admin/index');
});

router.post('/generate-fake-posts', (req, res) => {
	for(let i=0; i < req.body.amount; i++){
		var post = new Post();
		post.title = faker.Internet.userName();
		post.status = 'public';
		post.allowComments = true;
		post.body = faker.Lorem.paragraphs();

		post.save(function(err) {
			if(err) throw err;
		});
		
	}
	res.redirect('/admin/posts');
});

module.exports = router;