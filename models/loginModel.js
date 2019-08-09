const mongoose = require('../database/mongo').mongoose
const Schema = mongoose.Schema

/* Schema for user collection */
const user = new Schema({
    uid: {
        type: 'String'
    },
    name: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
    },
    mode: {
        type: 'String',
        required: true
    }
})

module.exports = {
    user: mongoose.model('User', user)
}