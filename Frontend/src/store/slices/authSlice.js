import { createSlice } from "@reduxjs/toolkit";
import { loginAPI, logoutUser, signupAPI } from "../thunks/authThunk";

const initialState = {
  isAuthenticated: Boolean(localStorage.getItem("accessToken")?.trim()),
  email: localStorage.getItem("email")?.trim() || null,
  loading: false,
  error: null,
  isTokenExpired: false,
};

const authSlice = createSlice({
  name:"auth",
  initialState,
  extraReducers(builder){
    builder.addCase(signupAPI.pending, (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupAPI.fulfilled, (state,action) => {
      const {user} = action.payload;
      state.email = user.email;
      state.loading = false;
    });
    builder.addCase(signupAPI.rejected, (state,action) => {
      const errorMessage = action.payload;
      state.loading = false;
      state.error = errorMessage;
    });
    
    builder.addCase(loginAPI.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.isAuthenticated = false;
      state.email = null;
      state.isTokenExpired = false;
    });
    builder.addCase(loginAPI.fulfilled, (state,action) => {
      const email = action.payload;
      state.loading = false;
      state.email = email;
      state.isAuthenticated = true;
    });
    builder.addCase(loginAPI.rejected, (state,action) => {
      const errorMessage = action.payload;
      state.loading = false;
      state.error= errorMessage;
    });

    builder.addCase(logoutUser.fulfilled, (state,action) => {
      state.isAuthenticated = false;
      state.email = null;
      state.isTokenExpired = action.payload
    })
  },
});

export default authSlice.reducer;