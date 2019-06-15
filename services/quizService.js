const csit = require('../models/quizModel').CSIT
const sports = require('../models/quizModel').Sports
const entertainment = require('../models/quizModel').Entertainment
const curraff = require('../models/quizModel').CurrAf
const leaderBoard = require('../models/leaderBoardModel').leaderBoard
class quizService {
    async getQuestionCsit(){
        let response = []
        let quesIds = new Set()
        for (; ;) {
            let quesId = Math.floor(Math.random() * 14) +1
            quesIds.add(quesId)
            if(quesIds.size == 10){
                break
            }
        }
        for (var it = quesIds.values(), val= null; val=it.next().value; ) {
            let ques = await csit.findOne({Qid : val},{_id:0, __v:0, Ans:0})
            response.push(ques)
        }
        return response
    }

    async getQuestionSports(){
        let response = []
        let quesIds = new Set()
        for (; ;) {
            let quesId = Math.floor(Math.random() * 14) +1
            quesIds.add(quesId)
            if(quesIds.size == 10){
                break
            }
        }
        for (var it = quesIds.values(), val= null; val=it.next().value; ) {
            let ques = await sports.findOne({Qid : val},{_id:0, __v:0, Ans:0})
            response.push(ques)
        }
        return response
    }

    async getQuestionCurraf(){
        let response = []
        let quesIds = new Set()
        for (; ;) {
            let quesId = Math.floor(Math.random() * 14) +1
            quesIds.add(quesId)
            if(quesIds.size == 10){
                break
            }
        }
        for (var it = quesIds.values(), val= null; val=it.next().value; ) {
            let ques = await curraff.findOne({Qid : val},{_id:0, __v:0, Ans:0})
            response.push(ques)
        }
        return response
    }

    async getQuestionEntertainment(){
        let response = []
        let quesIds = new Set()
        for (; ;) {
            let quesId = Math.floor(Math.random() * 14) +1
            quesIds.add(quesId)
            if(quesIds.size == 10){
                break
            }
        }
        for (var it = quesIds.values(), val= null; val=it.next().value; ) {
            let ques = await entertainment.findOne({Qid : val},{_id:0, __v:0, Ans:0})
            response.push(ques)
        }
        return response
    }
    
    async checkAns(data){
        if(data.category == 'csit'){
            let res = await csit.findOne({Qid : data.qid},{Ans:1})
            if(data.answer == res.Ans){
                return true
            }
            return false
        }else if(data.category == 'sports'){
            let res = await sports.findOne({Qid : data.qid},{Ans:1})
            if(data.answer == res.Ans){
                return true
            }
            return false
        }else if(data.category == 'currAff'){
            let res = await curraff.findOne({Qid : data.qid},{Ans:1})
            if(data.answer == res.Ans){
                return true
            }
            return false
        }else if(data.category == 'entertainment'){
            let res = await entertainment.findOne({Qid : data.qid},{Ans:1})
            if(data.answer == res.Ans){
                return true
            }
            return false
        }
    }

    async submitScore(data){
        const result = await leaderBoard.insertMany([data])
        console.log(result)
        if(result[0]._id){
            console.log('Inserted')
            return true
        }else{
            console.log('Not')
            return false
        }
    }

    async leaderBoard(data){
        let response = []
        if(!data){
            response = await leaderBoard.find().sort({score:-1})
        }
        return response
    }
}

module.exports = new quizService()