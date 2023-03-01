const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const user = new Schema({
    enrollment: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

module.exports = mongoose.model('Users', user);