const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    body:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('comments', CommentSchema);