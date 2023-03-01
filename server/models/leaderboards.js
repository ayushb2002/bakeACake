const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const leaderboard = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'Users'},
    points: {type: Number, required: true},
    date: {type: Date, default: Date.now},
    lastAttempt: {type: Number, required: true}
});

module.exports = mongoose.model('Leaderboards', leaderboard);