import React from "react";
import { LogOut, CheckCircle2, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <div
      data-theme="lemonade"
      className="min-h-screen flex flex-col items-center bg-base-200 relative"
    >
      {/* Logout button */}
      <button
        className="btn btn-primary absolute top-6 right-6"
        onClick={() => navigate("/logout")}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>

      {/* Logo */}
      <h1 className="text-6xl font-extrabold mt-40 text-success">
        <span className="text-success">Q</span>uiz
      </h1>

      {/* Card */}
      <div className="card bg-base-100 shadow-2xl rounded-box w-full max-w-md p-8 mt-8 ">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <HelpCircle size={80} className="text-info mb-4" />

          {/* Title */}
          <p className="text-2xl font-bold text-base-content mb-2">
            Are you ready?
          </p>

          {/* Subtitle */}
          <p className="text-base text-base-content mb-6 opacity-80">
            Let's see how many questions you can answer:
          </p>

          {/* Checklist */}
          <ul className="space-y-2 text-left mb-6">
            <li className="flex items-center text-base-content">
              <CheckCircle2 className="text-success mr-2" />
              There are 30 questions
            </li>
            <li className="flex items-center text-base-content">
              <CheckCircle2 className="text-success mr-2" />
              You need to pick 1 answer
            </li>
          </ul>

          {/* Start Quiz Button */}
          <button
            className="btn btn-warning w-full text-lg font-semibold"
            onClick={() => navigate("/questions")}
          >
            I'm Ready - Start the Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
