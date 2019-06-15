const service = require('../services/quizService')

const quiz = (req,res) => {
    if(req.session.userId){
        res.render('questions')
    }else{
        res.redirect('index')
    }
}

const quizIt = async (req,res) => {
    const ques = await service.getQuestionCsit()
    res.send(ques)
}

const quizSports = async (req,res) => {
    const ques = await service.getQuestionSports()
    res.send(ques)
}

const quizEntertainment = async (req,res) => {
    const ques = await service.getQuestionEntertainment()
    res.send(ques)
}

const quizCurraf = async (req,res) => {
    const ques = await service.getQuestionCurraf()
    res.send(ques)
}

const checkAns = async (req, res) => {
    const exAns = ansFormat(req.body)
    const result = await service.checkAns(exAns)
    res.send(result)
}

function ansFormat(data){
    return {qid, answer, category} = data
}

function scoreFormat(data){
    return {score, category} = data
}

const submitScore = async (req,res) => {
    const scoreData = scoreFormat(req.body)
    scoreData.name = req.session.userName
    scoreData.userID = req.session.userId
    const result = await service.submitScore(scoreData)
    if(result){
        res.send(true)
    }else{
        res.send(false)
    }
}

const leaderBoard = async (req, res) => {
    const result = await service.leaderBoard()
    if(result){
        res.send(result)
    }
}

module.exports = {
    quiz,
    quizIt,
    checkAns,
    submitScore,
    leaderBoard,
    quizCurraf,
    quizEntertainment,
    quizSports
}