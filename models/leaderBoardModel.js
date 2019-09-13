const mongoose = require('../database/mongo').mongoose
const Schema = mongoose.Schema

/* Schema for leader board collection */
const leaderBoard = new Schema({
    userID:
    {
        type: 'String',
        required: true
    },
    name:
    {
        type: 'String',
        required: true
    },
    score: {
        type: 'number',
        required: true
    },
    quizId: {
        type: 'String',
        required: true
    }
})

module.exports = {
    leaderBoard: mongoose.model('leaderBoard', leaderBoard),
}