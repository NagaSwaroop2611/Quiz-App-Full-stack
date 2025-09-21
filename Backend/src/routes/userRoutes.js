const express = require("express");
const { registerUser, loginUser, quizAttempts } = require("../controllers/userController.js");
const authenticateUser = require("../middleware/userMiddleware.js");

const userRouter = express.Router();

// POST /api/v1/users/register
userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/quiz-attempts",authenticateUser,quizAttempts);


module.exports= userRouter;

