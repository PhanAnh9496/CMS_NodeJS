const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({

    title:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default:'public'
    },
    allowComments:{
        type: Boolean,
        require: require
    },
    body:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model('posts', PostSchema);