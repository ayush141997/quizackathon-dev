const mongoose = require('../database/mongo').mongoose
const Schema = mongoose.Schema

/* Schema for information technology category collection */
const quizes = new Schema({
    name : {
        type : 'String',
        required : true,
        unique: true
    },
    status : {
        type : 'String',
        enum : ['Ongoing', 'Ended'],
        required : true
    }
})

module.exports =  {
    quizes: mongoose.model('quizes', quizes)
}