var express = require('express');
var router = express.Router();

router.post('/', (req,res) => {
    res.send('is comment');
});

module.exports = router;