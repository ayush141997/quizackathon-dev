const mongoose = require('../database/mongo').mongoose
const Schema = mongoose.Schema

/* Schema for information technology category collection */
const questions = new Schema({
    Question : {
        type : 'String',
        required : true
    },
    op1 : {
        type : 'String',  
        required : true
    },
    op2 : {
        type : 'String',
        required : true
    },
    op3 : {
        type : 'String',
        required : true
    },
    op4: {
        type : 'String',
        required : true
    },
    Ans:{
        type : 'String',
        required : true
    },
    quizId:{
        type : 'String',
        required : true 
    }
})

module.exports =  {
    Questions: mongoose.model('Question', questions)
}