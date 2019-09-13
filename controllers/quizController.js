const service = require('../services/quizService') // To import the quiz service

/* To show the questions entry page
@Param req : request object
@Param res : response object
*/
const quiz = (req, res) => {
    if (req.session.userId) {
        res.render('questions')
    } else {
        res.redirect('index')
    }
}

/* To get questions from the database
@Param req : request object
@Param res : response object
*/
const getQuestions = async (req, res) => {
    const data = {
        role: req.body.role,
        name: req.session.userName ? req.session.userName : '',
        userID: req.session.userId ? req.session.userId : '',
        quizId: req.body.quizId
    }
    const ques = await service.getQuestions(data)
    res.send(ques)
}

/* To check answer
@Param req : request object
@Param res : response object
*/
const checkAns = async (req, res) => {
    const exAns = ansFormat(req.body)
    const result = await service.checkAns(exAns, req.session.userId)
    res.send(result)
}

/* To format answer data according to suitable format
@Param data : data from the frontend

@return : formatted data
*/
function ansFormat(data) {
    return { qid, answer } = data
}

/* To submit score into database
@Param req : request object
@Param res : response object
*/
const submitScore = async (req, res) => {
    const scoreData = {}
    scoreData.name = req.session.userName
    scoreData.userID = req.session.userId
    const result = await service.submitScore(scoreData)
    if (result) {
        res.send(true)
    } else {
        res.send(false)
    }
}

/* To get the leaderboard from the database
@Param req : request object
@Param res : response object
*/
const leaderBoard = async (req, res) => {
    data = req.body.quizId
    const result = await service.leaderBoard(data)
    if (result) {
        res.send(result)
        return
    }
    res.send ({
        status: 404
    })
}

const addQuestion = async (req, res) => {
    data = req.body
    let response = await service.addQuestion(data)
    if (response) {
        res.send({
            status: 200,
            data: response
        })
        return
    }
    res.send({
        status: 500
    })
}

const deleteQuestion = async (req, res) => {
    id = req.body.qid
    let response = await service.deleteQuestion(id)
    if (response) {
        res.send({
            status: 200,
            data: response
        })
        return
    }
    res.send({
        status: 500
    })
}

const getQuestionById = async (req, res) => {
    let id = req.query.id
    let response = await service.getQuestionById(id)
    res.send(response)
}

const getQuizes = async (req, res) => {
    let response = await service.getQuizes()
    res.send(response)
}

const addQuiz = async (req, res) => {
    let quiz = {}
    quiz.name = req.body.name
    quiz.status = 'Ongoing'
    let response = await service.addQuiz(quiz)
    res.send(response)
}

const endQuiz = async (req, res) => {
    let id = req.body.id
    let response = await service.endQuiz(id)
    res.send(response)
}

module.exports = {
    quiz,
    checkAns,
    submitScore,
    leaderBoard,
    getQuestions,
    addQuestion,
    deleteQuestion,
    getQuestionById,
    getQuizes,
    addQuiz,
    endQuiz
}