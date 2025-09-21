const mongoose = require("mongoose");

const QUIZ_STATUS_PENDING = "pending"
const QUIZ_STATUS_COMPLETED = "completed";
const ANSWER_STATUS_PENDING = "pending";
const ANSWER_STATUS_RIGHT = "right";
const ANSWER_STATUS_WRONG = "wrong";

/*
How Mongoose handles _id in subdocuments:
1. Arrays of objects → by default, each element gets its own _id.
2.Single nested objects (not in an array) → do not automatically get an _id.
*/
const UserQuizSchema = new mongoose.Schema(
  {
    user_id: String,
    quiz_status: {
      type: String,
      enum: [QUIZ_STATUS_PENDING,QUIZ_STATUS_COMPLETED],
    },
    questions:[
      {
        _id: false,
        question_id:{
          type : mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        attempted: Boolean,
        answer_status : {
          type:String,
          enum:[
            ANSWER_STATUS_PENDING,
            ANSWER_STATUS_RIGHT,
            ANSWER_STATUS_WRONG,
          ],
        },
        submitted_answer:{
          _id:false,
          id: Number,
          value: String,
        },
      },
    ],
    result:{
      correct_count:{
        type: Number,
        default :0
      },
      incorrect_count:{
        type: Number,
        default :0
      },
    },
  },
  {timestamps : true}
);

// instance methods 
UserQuizSchema.methods.updateResult = function(){
  // here "this" points to the document instance
  let result = this.questions.reduce(
    function(acc,curr){
      if(curr.answer_status === ANSWER_STATUS_RIGHT){
         acc["correct_count"] +=1;
      }
      else if(curr.answer_status === ANSWER_STATUS_WRONG){
        acc["incorrect_count"] += 1;
      }
      return acc;
    },{
      correct_count : 0,
      incorrect_count:0,
    }
  );
  this.result = result;
  this.save();
};

const UserQuiz = mongoose.models.UserQuiz || mongoose.model("UserQuiz", UserQuizSchema);

module.exports = {
  UserQuiz,
  QUIZ_STATUS_PENDING,
  QUIZ_STATUS_COMPLETED,
  ANSWER_STATUS_PENDING,
  ANSWER_STATUS_RIGHT,
  ANSWER_STATUS_WRONG
};
