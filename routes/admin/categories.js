var express = require('express');
var router = express.Router();
const Category = require('../../models/Category');
const {userAuthenticated} = require('../../helpers/authentication');

//add userAuthenticated
router.all('/*',(req, res, next) => {
	req.app.locals.layout = 'admin';
	next();
});

//Method GET
router.get('/', function (req, res, next) {
    Category.find({}).then(categories => {
        res.render('admin/categories/index', {
            categories: categories
        });
    });
});

//Method POST
router.post('/create', function (req, res, next) {
    const newCategory = Category({
        name: req.body.name
    });
    newCategory.save()
        .then(saveCategory => {
            res.redirect('/admin/categories');
        });
});

//Method PUT
router.get('/edit/:id', function (req, res, next) {
    Category.findOne({
            _id: req.params.id
        })
        .then(category => {
            res.render('admin/categories/edit', {
                category: category
            });
        });
});
router.put('/edit/:id', function (req, res, next) {
    Category.findOne({
            _id: req.params.id
        })
        .then(category => {
            category.name = req.body.name;
            category.save()
                .then(savedCategory => {
                    res.redirect('/admin/categories');
                });
        });
});

//Method DELETE
router.delete('/:id', (req, res) => {
    Category.remove({_id:req.params.id})
            .then(result => {
                 res.redirect('/admin/categories');
            });
});

module.exports = router;