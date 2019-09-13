const Questions = require('../models/questionModel').Questions
const quizes = require('../models/quizModel').quizes
const leaderBoard = require('../models/leaderBoardModel').leaderBoard

class quizService {
    /* To get the questions from the database according category passed
    @Param category : category of the questions selected

    @return response : Array of question fetched from the database
    */
    async getQuestions(data) {
        let ques = []
        if (data.role === 'admin') {
            ques = await Questions.find({quizId: data.quizId}, { Question: 1, _id: 1 })
        } else {
            let ongoingQuiz = await quizes.findOne({status:"Ongoing"},{_id:1})
            let user = await leaderBoard.findOne({userID: data.userID, quizId: ongoingQuiz._id})
            if(ongoingQuiz){
                if(user){
                    return {
                        status: 200,
                        message: 'Quiz already taken'
                    }
                }
                let cand = {
                    name: data.name,
                    userID: data.userID,
                    score: 0,
                    quizId: ongoingQuiz._id
                }
                let response = await this.submitScore(cand)
                if (response) {
                    ques = await Questions.find({quizId: ongoingQuiz._id}, { __v: 0, Ans: 0 })
                }
            } else{
                return {
                    status: 500
                }
            }
        }
        return ques
    }

    async getQuestionById(id) {
        let ques = await Questions.findById(id)
        if (ques) {
            return {
                status: 200,
                ques: ques
            }
        }
        return {
            status: 404
        }
    }

    async addQuestion(data) {
        console.log(data)
        let response
        console.log("ghghhg", data.quesId)
        if (data.quesId == '') {
            console.log('hi')
            delete data.quesId
            response = await Questions.insertMany([data])
        } else {
            let id = data.quesId
            delete data.quesId
            response = await Questions.findByIdAndUpdate(id, data)
        }
        if (response) {
            return response
        }
        return false
    }

    async deleteQuestion(id) {
        let response = await Questions.findByIdAndDelete(id)
        console.log("Del", response)
        if (response) {
            return response._id
        }
        return false
    }


    /* To fetch and check the answer
    @Param data : data from the frontend conatining category, qid and answer

    @return (Boolean) : true if answer matched else false
    */
    async checkAns(data, userID) {
        let res = await Questions.findOne({ _id: data.qid }, { Ans: 1 })
        if (res) {
            if (data.answer == res.Ans) {
                await leaderBoard.update({ userID: userID }, { $inc: { score: 1 } })
            }
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
    /* async getQuestionByCategory(category, qid, projection) {
        let res
        if (category == 'csit') {
            res = await csit.find({ category: category }, projection)
        } else if (category == 'sports') {
            res = await sports.findOne({ Qid: qid }, projection)
        } else if (category == 'currAff') {
            res = await curraff.findOne({ Qid: qid }, projection)
        } else if (category == 'entertainment') {
            res = await entertainment.findOne({ Qid: qid }, projection)
        }
        return res
    } */

    /* store the final score in the database
    @Param data : data of the user including the final score

    @return (Boolean) : true if successfully stored else false
    */
    async submitScore(data) {
        const result = await leaderBoard.insertMany([data])
        if (result[0]._id) {
            console.log(result)
            return true
        } else {
            return false
        }
    }

    /* Fetch the score data for the leaderboard
    @Param data : filtering and sorting data

    @return response : records based on passed criteria
    */
    async leaderBoard(quizId) {
        let response = await leaderBoard.find({quizId: quizId}).sort({ score: -1 })
        if(response.length > 0){
            return response
        }
        return false
    }

    async getQuizes() {
        let quiz = await quizes.find()
        if(quiz.length>0){
            return {
                status: 200,
                quizes: quiz
            }
        }
        return {
            status: 404
        }
    }

    async addQuiz(quiz){
        let response = await quizes.insertMany([quiz])
        if(response.length > 0){
            return {
                status: 200,
                quiz: response[0]
            }
        }
        return {
            status: 500
        }
    }

    async endQuiz(id){
        let response = await quizes.findByIdAndUpdate(id, {status: 'Ended'})
        if(response){
            return {
                status: 200,
                quiz: response
            }
        }
        return {
            status: 404
        }
    }
}

module.exports = new quizService()