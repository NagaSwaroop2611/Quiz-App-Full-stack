const { QUIZ_STATUS_PENDING, QUIZ_STATUS_COMPLETED, UserQuiz: UserQuizModel } = require("../models/userQuizModel.js");
const User = require("../models/userModel.js");
const Question = require("../models/questionModel.js")


const submitQuiz = async (req, res) => {
  try {
    //Find the current Quiz
    let userCurrentQuiz = await UserQuizModel.findOne({
      user_id: req.user._id,
      quiz_status: QUIZ_STATUS_PENDING,
    });

    if (!userCurrentQuiz) {
      return res
        .status(500)
        .json({ success: false, message: "No active quiz for the user" });
    }

    //Mark Quiz as completed and save it
    userCurrentQuiz.quiz_status = QUIZ_STATUS_COMPLETED;

    //Increase the attempts count
    const user = await User.findOne({ _id: req.user._id });
    user.quiz_attempts = user.quiz_attempts + 1;
    await user.save();
    await userCurrentQuiz.save();

    //Create two arrays for showing what questions we selected wrong, what is there correct answer
    let incorrect_questions = [];
    let correct_questions = [];

    //Loop through all Quiz questions
    for (const userQuestion of userCurrentQuiz.questions) {
      const questionModel = await Question.findById(userQuestion.question_id);

      //Build Data object for each question

      let _data = {
        question_id: userQuestion.question_id,
        question: questionModel.question,
        answer: questionModel.answer,
        attempted: userQuestion.attempted,
        answer_status: userQuestion.answer_status,
        submitted_answer: userQuestion.submitted_answer,
      };

      //Check answers are correct or not and close the loop.

      if (
        questionModel.answer.id === userQuestion.submitted_answer.id &&
        questionModel.answer.value === userQuestion.submitted_answer.value
      ) {
        correct_questions.push(_data);
      } else {
        incorrect_questions.push(_data);
      }
    }

    return res.send({
      success: true,
      result: userCurrentQuiz.result,
      incorrect_questions,
      correct_questions,
    });
  } catch (error) {
    console.error("Error, Fetching Quiz");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const completedQuizQuestions = async (req, res) => {
  try {
    const userCurrentQuiz = await UserQuizModel.find({
      user_id: req.user._id,
      quiz_status: QUIZ_STATUS_COMPLETED,
    }).sort({ createdAt: -1 }); // optional: get most recent

    if (!userCurrentQuiz) {
      return res
        .status(500)
        .json({ success: false, message: "No quiz found for the user" });
    }

    let incorrect_questions = [];
    let correct_questions = [];

    for (const userQuestion of userCurrentQuiz[0].questions) {
      const questionModel = await Question.findById(userQuestion.question_id);

      let _data = {
        question_id: userQuestion.question_id,
        question: questionModel.question,
        answer: questionModel.answer,
        attempted: userQuestion.attempted,
        answer_status: userQuestion.answer_status,
        submitted_answer: userQuestion.submitted_answer,
      };

      if (
        questionModel.answer.id === userQuestion.submitted_answer?.id &&
        questionModel.answer.value === userQuestion.submitted_answer?.value
      ) {
        correct_questions.push(_data);
      } else {
        incorrect_questions.push(_data);
      }
    }

    return res.send({
      status: true,
      result: userCurrentQuiz[0].result,
      incorrect_questions,
      correct_questions,
    });
  } catch (error) {
    console.error("Error, Fetching Quiz", error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};


module.exports = {submitQuiz,completedQuizQuestions};