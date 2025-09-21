import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useQuestionState from "../hooks/useQuestionState";
import { useDispatch } from "react-redux";
import { fetchQuestionsAPI, submitQuizAPI, validateAnswerAPI } from "../store/thunks/questionsThunk";
import { Option } from "./Option";
import { routes } from "../App";
import { activeNextQuestion } from "../store/slices/questionSlice";


const QuestionScreen = () => {
  const [userSelectedOption, setUserSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false); //Prevents further selection after answering

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    activeQuestion,
    activeQuestionNumber,
    totalQuestions,
    activeQuestionId,
    loading,
    isValidatingAnswer,
    isSubmittingQuiz,
    error,
  } = useQuestionState();

  useEffect(() => {
    dispatch(fetchQuestionsAPI());
  }, [dispatch]);

  const handleOptionClick = useCallback(
    async (selectedOption) => {
      if (isAnswered || isValidatingAnswer) return;

      setUserSelectedOption(selectedOption);

      try {
        await dispatch(
          validateAnswerAPI({
            questionId: activeQuestionId,
            answer: selectedOption,
          })
        ).unwrap();

        setIsAnswered(true);
      } catch (error) {
        console.error("Error validating answer", error);
        setIsAnswered(true);
      }
    },
    [activeQuestionId, dispatch, isAnswered, isValidatingAnswer]
  );

  const isFinalQuestion = useMemo(
    () => activeQuestionNumber === totalQuestions,
    [activeQuestionNumber, totalQuestions]
  );

  const moveForward = useCallback(() => {
    if (isFinalQuestion) {
      console.log(isFinalQuestion);
      dispatch(submitQuizAPI());
      navigate(routes.protectedRoutes.result);
    } else {
      dispatch(activeNextQuestion());
      setIsAnswered(false);
      setUserSelectedOption(null);
    }
  }, [dispatch, isFinalQuestion, navigate]);

  if (loading || !activeQuestionId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary loading-xl"></span>
      </div>
    );
  }

  if (Boolean(error)) {
    return (
      <div className="toast toast-center toast-middle">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-theme="lemonade"
      className="min-h-screen flex flex-col items-center bg-base-200 relative"
    >
      {/* Logout Button */}
      <button
        className="btn btn-primary absolute top-6 right-6"
        onClick={() => navigate(routes.protectedRoutes.logout)}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>

      {/* Logo */}
      <h1 className="text-6xl font-extrabold mt-12 text-success">
        <span className="text-success">Q</span>uiz
      </h1>

      {/* Progress bar */}
      <div className="w-3/4 mt-8">
        <progress
          className="progress progress-warning w-full"
          value={activeQuestionNumber}
          max={totalQuestions}
        ></progress>
      </div>

      {/* Question Card */}
      <div className="card bg-base-100 shadow-2xl rounded-box w-full max-w-xl p-10 mt-10">
        <div className="flex flex-col items-center text-center">
          {/* Question Number */}
          <div className="rounded-full bg-success text-white w-16 h-16 flex items-center justify-center text-xl font-bold mb-6">
            {activeQuestionNumber}/{totalQuestions}
          </div>

          {/* Question */}
          <p className="text-xl font-semibold text-base-content mb-6">
            {activeQuestion?.question}
          </p>

          {/* Options */}
          <ul className="space-y-3 w-full">
            {activeQuestion.options.map((option) => {
              const isThisSelected = userSelectedOption
                ? userSelectedOption?.id === option.id
                : false;

              const isCorrect =
                activeQuestion.answer_status === "right" && isThisSelected;

              // const isWrong =
              //   activeQuestion.answer_status === "wrong" && isThisSelected;

              return (
                <Option
                  key={option.id}
                  option={option}
                  isSelected={isThisSelected}
                  isCorrect={isCorrect}
                  isAnswered={isAnswered}
                  isValidating={isValidatingAnswer && isThisSelected}
                  onClick={handleOptionClick}
                />
              );
            })}
          </ul>

          {/* Next Button */}
          <button
            className={`btn w-full mt-8 text-lg font-semibold ${
              !isFinalQuestion ? "btn-success" : "btn-primary"
            } ${isSubmittingQuiz ? "loading" : ""}`}
            onClick={moveForward}
            disabled={!isAnswered || isSubmittingQuiz}
          >
            {isSubmittingQuiz
              ? "Submitting..."
              : isFinalQuestion
              ? "Submit Quiz"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
