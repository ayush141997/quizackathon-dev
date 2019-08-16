const mongoose = require('../database/mongo').mongoose
const Schema = mongoose.Schema

/* Schema for information technology category collection */
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

/* Schema for entertainment category collection */
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

/* Schema for sports category collection */
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

/* Schema for current affairs category collection */
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