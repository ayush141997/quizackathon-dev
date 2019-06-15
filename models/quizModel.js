const mongoose = require('../database/mongo').mongoose
const Schema = mongoose.Schema

const CSIT = new Schema({
    Question : {
        type : 'String',
        required : true
    },

    Qid:
    {
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
    }

})

const Entertainment = new Schema({
    Question : {
        id: "Number",
        type : 'String',
        required : true
    },
    Qid:
    {
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
    }

})


const Sports = new Schema({
    Question : {
        id: "Number",
        type : 'String',
        required : true
    },
    Qid:
    {
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
    }


})

const CurrAf = new Schema({
    Question : {
        id: "Number",
        type : 'String',
        required : true
    },
    Qid:
    {
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
    }

})

module.exports =  {
    CSIT: mongoose.model('CSIT', CSIT),
    Entertainment : mongoose.model('Entertainment', Entertainment),
    Sports : mongoose.model('Sports', Sports),
    CurrAf : mongoose.model('CurrAf', CurrAf)
}