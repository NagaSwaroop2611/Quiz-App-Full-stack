import React from "react";
export const Option = ({
  option,
  isSelected,
  isCorrect,
  isAnswered,
  isValidating,
  onClick,
}) => {
  const handleClick = () => {
    if (!isAnswered && !isValidating) {
      onClick(option);
    }
  };

  //Determine styling based on selection and correctnes
  const getOptionStyle = () => {
    if (!isAnswered) {
      if (isValidating && isSelected) {
        return "bg-warning/20 border-warning animate-pulse";
      }
      return "hover:bg-base-200 transition-colors duration-200 border-base-300";
    }

    if (isSelected) {
      return isCorrect
        ? "bg-success text-success-content border-success"
        : "bg-error text-error-content border-error";
    } else if (isCorrect) {
      //show them correct option if not selected
      return "bg-success/20 border-success";
    }
    return "bg-base-100 border-base-300";
  };

  const getRadioStyle = () => {
    if (!isAnswered) {
      if (isValidating && isSelected) return "radio-warning";
      return "radio-primary";
    }

    if (isSelected) {
      return isCorrect ? "radio-success" : "radio-error";
    } else if (isCorrect) {
      return "radio-success";
    }
    return "radio";
  };

  const getCursorStyle = () => {
    if (isAnswered || isValidating) return "cursor-not-allowed";
    return "cursor-pointer";
  };
  return (
    <li
      className={`list-row rounded-lg border-2 p-4 mb-3 transition-all duration-300 ${getOptionStyle()} ${getCursorStyle()}`}
      onClick={handleClick}
    >
      <label className={`flex items-center w-full ${getCursorStyle()}`}>
        <input
          type="radio"
          className={`mr-4 ${getRadioStyle()}`}
          checked={isSelected}
          disabled={isAnswered || isValidating}
          readOnly
        />
        <span className="flex-1 text-left">{option.value}</span>

        {/* Loading indicator when validating */}
        {isValidating && isSelected && (
          <span className="loading loading-ball loading-sm ml-2"></span>
        )}
      </label>
    </li>
  );
};
