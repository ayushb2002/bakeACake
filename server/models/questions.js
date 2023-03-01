const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questions = new Schema({
    qNo: { type: Number, required: true, unique: true},
    question: { type: String, required: true},
    file: {type: String},
    answer: {type: String, required:true}
});

module.exports = mongoose.model('Questions', questions);