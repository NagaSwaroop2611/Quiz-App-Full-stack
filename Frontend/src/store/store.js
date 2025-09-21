import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import questionReducer from "./slices/questionSlice.js";
import resultReducer from "./slices/resultSlice.js";

const store = configureStore({
  reducer:{
    auth: authReducer,
    questions: questionReducer,
    result: resultReducer
  },
});

export default store;