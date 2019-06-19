const csit = require('../models/quizModel').CSIT
const sports = require('../models/quizModel').Sports
const entertainment = require('../models/quizModel').Entertainment
const curraff = require('../models/quizModel').CurrAf
const leaderBoard = require('../models/leaderBoardModel').leaderBoard

class quizService {

    /* To get the questions from the database according category passed
    @Param category : category of the questions selected

    @return response : Array of question fetched from the database
    */
    async getQuestions(category) {
        let response = []
        let quesIds = new Set()
        for (; ;) {
            let quesId = Math.floor(Math.random() * 14) + 1
            quesIds.add(quesId)
            if (quesIds.size == 10) {
                break
            }
        }
        for (var it = quesIds.values(), val = null; val = it.next().value;) {
            let ques = await this.getQuestionByCategory(category, val, { _id: 0, __v: 0, Ans: 0 })
            response.push(ques)
        }
        return response
    }

    /* To fetch and check the answer
    @Param data : data from the frontend conatining category, qid and answer

    @return (Boolean) : true if answer matched else false
    */
    async checkAns(data) {
        let res = await this.getQuestionByCategory(data.category,data.qid,{ Ans : 1 })
        if (data.answer == res.Ans) {
            return true
        }
        return false
    }

    /* to get the question from database based on category and qid
    @Param category : category of the questions selected
    @Param qid : Id of the question
    @Param projection : fields to be included or excluded from the fetched results

    @return res : question fetched
    */
    async getQuestionByCategory(category,qid,projection) {
        let res
        if (category == 'csit') {
            res = await csit.findOne({ Qid: qid },projection)
        } else if (category == 'sports') {
            res = await sports.findOne({ Qid: qid },projection)
        } else if (category == 'currAff') {
            res = await curraff.findOne({ Qid: qid },projection)
        } else if (category == 'entertainment') {
            res = await entertainment.findOne({ Qid: qid },projection)
        }
        return res
    }

    /* store the final score in the database
    @Param data : data of the user including the final score

    @return (Boolean) : true if successfully stored else false
    */
    async submitScore(data) {
        const result = await leaderBoard.insertMany([data])
        if (result[0]._id) {
            return true
        } else {
            return false
        }
    }

    /* Fetch the score data for the leaderboard
    @Param data : filtering and sorting data

    @return response : records based on passed criteria
    */
    async leaderBoard(data) {
        let response = []
        if (!data) {
            response = await leaderBoard.find().sort({ score: -1 })
        }
        else {
            response = await leaderBoard.find({category : data}).sort({ score: -1 })
        }
        return response
    }
}

module.exports = new quizService()