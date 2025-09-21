import {createSlice} from "@reduxjs/toolkit";
import { fetchQuestionsAPI, submitQuizAPI, validateAnswerAPI } from "../thunks/questionsThunk";


const initialState = {
  questions: [], //list of all quiz questions
  activeQuestionId:"", //the currently shown question
  loading: true, //flag for loading question
  isValidatingAnswer : false, //flag during answer validation
  isSubmittingQuiz: false, //flag during quiz submission
  error: null, // to capture any error
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers:{
    activeNextQuestion(state) {
      const currentIndex = state.questions.findIndex(
        question => question._id === state.activeQuestionId
      );
      if (currentIndex !== -1 && (currentIndex + 1) < state.questions.length) {
        state.activeQuestionId = state.questions[currentIndex + 1]._id;
      }
    }
  },
  extraReducers(builder){
    builder.addCase(fetchQuestionsAPI.pending, (state) => {
      state.questions = [];
      state.activeQuestionId = "";
      state.loading = true;
      state.isValidatingAnswer = false;
      state.error = null;
    });
    builder.addCase(fetchQuestionsAPI.fulfilled, (state, action) => {
      
      state.questions = action.payload.questions;
      state.loading = false;
      const activeQuestionId = action.payload.questions?.find(
        (question) => !question.attempted
      )?._id || "";
      state.activeQuestionId = activeQuestionId;
      
    });
    builder.addCase(fetchQuestionsAPI.rejected, (state,action) => {
      const errorMessage = action.payload;
      state.loading = false;
      state.error = errorMessage;
    });

    builder.addCase(validateAnswerAPI.pending, (state) =>{
      state.isValidatingAnswer = true;
      state.error = null;
    });

    builder.addCase(validateAnswerAPI.fulfilled, (state, action) =>{
      state.isValidatingAnswer = false;
      const isCorrect = action.payload.status === 1;
      const activeQuestionId = state.activeQuestionId;
      const activeQuestionIndex = state.questions.findIndex(
        (question) => question._id === activeQuestionId
      );
      state.questions[activeQuestionIndex].attempted = true;
      state.questions[activeQuestionIndex].answer_status = isCorrect ? "right" : "wrong";
    });
    builder.addCase(validateAnswerAPI.rejected, (state, action) => {
      state.isValidatingAnswer = false;
      state.error = action.payload;
    });

    builder.addCase(submitQuizAPI.pending, (state) => {
      state.error = null;
      state.isSubmittingQuiz = true;
    });
    builder.addCase(submitQuizAPI.fulfilled, (state, action) => {
      state.isSubmittingQuiz = false;
      if(action.payload.status){
        state.questions = [];
        state.activeQuestionId = "";
      }else{
        state.error = "Couldn't Submit Quiz, something went wrong";
      }
    });
    builder.addCase(submitQuizAPI.rejected, (state, action) => {
      state.error = action.payload;
      state.isSubmittingQuiz = false;
    });
  },
});

export default questionSlice.reducer;

export const {activeNextQuestion} = questionSlice.actions;