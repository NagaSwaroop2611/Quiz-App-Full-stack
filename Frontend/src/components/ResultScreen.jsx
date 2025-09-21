import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LogOut, RotateCcw } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../App";
import {
  fetchAttemptsAPI,
  fetchCompletedQuizAPI,
} from "../store/thunks/resultThunk";
import useResultState from "../hooks/useResultState";

const ResultScreen = () => {
  const {
    inCorrectAnswers,
    correctAnswers,
    attempts,
    noOfCorrectAnswers,
    noOfInCorrectAnswers,
    totalQuestions,
    status,
    loading,
    error,
  } = useResultState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCompletedQuizAPI());
    dispatch(fetchAttemptsAPI());
  }, [dispatch]);

  const correctPercentage = useMemo(() => {
    if (!totalQuestions) return 0;
    return Math.floor((noOfCorrectAnswers / totalQuestions) * 100);
  }, [noOfCorrectAnswers, totalQuestions]);

  const handleReset = useCallback(() => {
    navigate(routes.protectedRoutes.questions);
  }, [navigate]);

  // ✅ Merge correct + incorrect into one list with flag
  const displayQuestions = useMemo(() => {
    const formattedCorrect = correctAnswers.map((q) => ({
      ...q,
      isCorrect: true,
    }));
    const formattedIncorrect = inCorrectAnswers.map((q) => ({
      ...q,
      isCorrect: false,
    }));
    return [...formattedCorrect, ...formattedIncorrect];
  }, [correctAnswers, inCorrectAnswers]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <span className="loading loading-infinity loading-xl m-auto"></span>
      </div>
    );
  }

  if (Boolean(error)) {
    return (
      <div className="flex flex-col h-screen">
        <div className="badge badge-error badge-xl m-auto">
          {typeof error === "string"
            ? error
            : error?.message || "Something went wrong"}
        </div>
      </div>
    );
  }

  return (
    <div
      data-theme="lemonade"
      className="min-h-screen flex flex-col items-center bg-base-200 relative"
    >
      {/* Logout + Restart Buttons */}
      <div className="absolute top-6 right-6 flex space-x-4">
        <button className="btn btn-primary" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </button>
        <Link to={routes.protectedRoutes.logout} replace={true}>
          <button className="btn btn-primary">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </Link>
      </div>

      {/* Logo */}
      <h1 className="text-6xl font-extrabold mt-10 text-success">
        <span className="text-success">Q</span>uiz
      </h1>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mt-12 p-6">
        {/* Left: Score Board */}
        <div className="card bg-base-100 shadow-2xl rounded-box p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Score Board</h2>

          <p className="text-center text-lg mb-6">
            You Have <span className="font-bold">Played a Total of</span>{" "}
            {attempts.attempts} Quizzes
          </p>

          {/* Circle Score */}
          <div className="flex justify-center mb-8">
            <div
              className="radial-progress text-success"
              style={{ "--value": correctPercentage, "--size": "8rem" }}
            >
              <span className="text-3xl font-bold">{noOfCorrectAnswers}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-purple-100 font-bold text-purple-700">
              100% <br />
              <span className="text-sm font-normal">Completions</span>
            </div>
            <div className="p-4 rounded-lg bg-green-100 font-bold text-green-700">
              {totalQuestions}
              <br />
              <span className="text-sm font-normal">Total Questions</span>
            </div>
            <div className="p-4 rounded-lg bg-green-100 font-bold text-green-700">
              {noOfCorrectAnswers} <br />
              <span className="text-sm font-normal">Correct Answers!</span>
            </div>
            <div className="p-4 rounded-lg bg-red-100 font-bold text-red-700">
              {noOfInCorrectAnswers}
              <br />
              <span className="text-sm font-normal">Wrong Answers!</span>
            </div>
          </div>
        </div>

        {/* Right: Answers */}
        <div className="card bg-base-100 shadow-2xl rounded-box p-8 max-h-[600px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Answers</h2>

          {loading || !displayQuestions.length ? (
            <div className="flex justify-center items-center h-24">
              <span>Loading...</span>
            </div>
          ) : (
            <>
              {displayQuestions.map((question, index) => (
                <div className="mb-6" key={question.question_id}>
                  <p className="font-semibold mb-2">
                    {index + 1}. {question.question}
                  </p>

                  <p className="mb-2">
                    <span className="font-semibold">Selected Answer:</span>
                    <span
                      className={`block px-4 py-2 rounded mt-1 font-bold ${
                        question.isCorrect
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {question.submitted_answer.id}.{" "}
                      {question.submitted_answer.value}
                    </span>
                  </p>

                  {!question.isCorrect && (
                    <p>
                      <span className="font-semibold">Correct Answer:</span>
                      <span className="block bg-green-200 text-green-700 font-bold px-4 py-2 rounded mt-1">
                        {question.answer.id}. {question.answer.value}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
