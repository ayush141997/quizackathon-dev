const service = require('../services/quizService') // To import the quiz service

/* To show the questions entry page
@Param req : request object
@Param res : response object
*/
const quiz = (req,res) => {
    if(req.session.userId){
        res.render('questions')
    }else{
        res.redirect('index')
    }
}

/* To get questions from the database
@Param req : request object
@Param res : response object
*/
const getQuestions = async (req, res) => {
    const category = req.query.category
    const ques = await service.getQuestions(category)
    res.send(ques)
}

/* To check answer
@Param req : request object
@Param res : response object
*/
const checkAns = async (req, res) => {
    const exAns = ansFormat(req.body)
    const result = await service.checkAns(exAns)
    res.send(result)
}

/* To format answer data according to suitable format
@Param data : data from the frontend

@return : formatted data
*/
function ansFormat(data){
    return {qid, answer, category} = data
}

/* To format score data according to suitable format
@Param data : data from the frontend

@return : formatted data
*/
function scoreFormat(data){
    return {score, category} = data
}

/* To submit score into database
@Param req : request object
@Param res : response object
*/
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

/* To get the leaderboard from the database
@Param req : request object
@Param res : response object
*/
const leaderBoard = async (req, res) => {
    data = req.body.category
    const result = await service.leaderBoard(data)
    if(result){
        res.send(result)
    }
}

module.exports = {
    quiz,
    checkAns,
    submitScore,
    leaderBoard,
    getQuestions
}