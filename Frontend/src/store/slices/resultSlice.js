import { createSlice } from "@reduxjs/toolkit";
import { fetchAttemptsAPI, fetchCompletedQuizAPI } from "../thunks/resultThunk";

const initialState = {
  status: false,
  inCorrectAnswers:[],
  correctAnswers:[],
  attempts: 0,
  loading: false,
  error: null,
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  extraReducers(builder){
    builder.addCase(fetchCompletedQuizAPI.pending, (state) =>{
      state.loading = false;
      state.error = null;
      state.status = false
    });
    builder.addCase(fetchCompletedQuizAPI.fulfilled, (state, action) => {
      state.status = action.payload.status;
      state.loading = false;
      state.correctAnswers = action.payload.correct_questions;
      state.inCorrectAnswers = action.payload.incorrect_questions;
      // console.log(action.payload.incorrect_questions);
      // console.log(state.inCorrectAnswers);
      
      
    });
    builder.addCase(fetchCompletedQuizAPI.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    builder.addCase(fetchAttemptsAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAttemptsAPI.fulfilled, (state,action) => {
      state.attempts= action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAttemptsAPI.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export default resultSlice.reducer;