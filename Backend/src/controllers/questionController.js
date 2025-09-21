const Question = require("../models/questionModel");
const { UserQuiz: UserQuizModel, QUIZ_STATUS_PENDING, ANSWER_STATUS_PENDING, ANSWER_STATUS_RIGHT, ANSWER_STATUS_WRONG } = require("../models/userQuizModel.js");

const MAX_QUESTION_COUNT = 10;

const getQuestions = async(req,res) => {
  try {

    // Finding incomplete quiz for the user and populate question details in one query
    let userQuiz = await UserQuizModel.findOne({
      user_id: req.user._id,
      quiz_status:QUIZ_STATUS_PENDING
    }).populate("questions.question_id",
      "question options"
    );

    // if no incomplete quiz exists,create a new one
    if(!userQuiz){
      // Get random questions from database without answer
      const randomQuestions = await Question.aggregate([
        { $sample: {size:MAX_QUESTION_COUNT} },
        {
          $project : {question:1,options:1}
        },
      ]);
      // format questions for user quiz documnet
      const quizQuestion = randomQuestions.map(
        (question) => ({
          question_id : question._id,
          attempted : false,
          answer_status : ANSWER_STATUS_PENDING,
          submitted_answer:null,
        })
      );

      // create a new quiz and save
      userQuiz = await new UserQuizModel({
        user_id: req.user._id,
        quiz_status: QUIZ_STATUS_PENDING,
        questions: quizQuestion,
      }).save();

      // populate the newly created quiz eith question details
      userQuiz = await userQuiz.populate("questions.question_id","question options");
    }

    // Format the response by combining question content with user's progress
    const questions = userQuiz.questions.map(q => {
      if(!q.question_id){
        return null;
      }
      return{
        _id:q.question_id._id,
        question : q.question_id.question,
        options: q.question_id.options,
        attempted: q.attempted,
        answer_status: q.answer_status,
        submitted_answer:q.submitted_answer
      }
    }).filter(q => q !== null); //removes all null entries

    return res.status(200).json({
      success: true,
      questions,
    })
  } catch (error) {
    console.error(error.message);
    res.status(400).send*"Something went wrong"
  }
};

const validateAnswer = async(req,res) => {
  try {
    const {questionId,answer} = req.body;

    // validate
    if(!questionId || !answer || !answer.id || !answer.value){
      return res.status(400).json({message:"Invalid request"});
    }

    // find question by id
    let question = await Question.findById(questionId);

    // validate
    if(!question){
      return res.status(400).json({message:"Question Does not Exist"});
    }

    let answerStatus = false;
    if(question.answer.id === answer.id && question.answer.value === answer.value){
      answerStatus = true;
    }

    const updatedUserQuiz = await UserQuizModel.findOneAndUpdate(
      {
      "questions.question_id": questionId,
      user_id: req.user._id,
      quiz_status : QUIZ_STATUS_PENDING
      },
      {
        $set: {
          "questions.$.attempted":true,
          "questions.$.answer_status":answerStatus
           ? ANSWER_STATUS_RIGHT 
           : ANSWER_STATUS_WRONG,
          "questions.$.submitted_answer":answer,
        },
      },{new:true} //to return the updated document which we are not using as of now
    );

    // update result using instance methods
    await updatedUserQuiz?.updateResult();

    return res.status(200).json({
      status: answerStatus ? 1 : 0,
      message : answerStatus ? "Correct Answer 😊" : "Wrong Answer 😢",
      submitted_answer: answer,
      correct_answer: question.answer
    });
  } catch (error) {
    console.error("Error creating task: ",error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {getQuestions,validateAnswer}