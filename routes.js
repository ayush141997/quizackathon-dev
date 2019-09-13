const loginController = require('./controllers/loginController')
const quizController = require('./controllers/quizController')

module.exports = (app) => {
    app.get('/', loginController.index)

    app.get('/index', loginController.index)

    app.get('/register', loginController.register)

    app.post('/signIn', loginController.signIn)

    app.post('/registerUser', loginController.registerUser)

    app.get('/signOut', loginController.signOut)

    app.get('/dashboard', loginController.dashboard)

    app.get('/quiz', quizController.quiz)

    app.post('/getQuestions', quizController.getQuestions)

    app.post('/checkAns', quizController.checkAns)

    app.post('/submitScore', quizController.submitScore)

    app.get('/admin', loginController.admin)

    app.get('/adminSignOut', loginController.adminSignOut)

    app.post('/adminSignIn', loginController.adminSignIn)

    app.get('/adminDashboard', loginController.adminDashboard)

    app.post('/leaderBoard',quizController.leaderBoard)

    app.post('/addQuestion', quizController.addQuestion)

    app.post('/delQuestion', quizController.deleteQuestion)

    app.get('/getQuestionById', quizController.getQuestionById)

    app.get('/getQuizes', quizController.getQuizes)

    app.post('/addQuiz', quizController.addQuiz)

    app.post('/endQuiz', quizController.endQuiz)
}