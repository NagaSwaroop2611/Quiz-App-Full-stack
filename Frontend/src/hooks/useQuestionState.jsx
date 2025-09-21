import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';

const useQuestionState = () => {
  const questionState = useSelector((state) => state.questions);

  const{
    questions,
    activeQuestionId,
    loading,
    isValidatingAnswer,
    isSubmittingQuiz,
    error,
  } = questionState;

  const activeQuestion = useMemo(() => {
    return questions.find((question) => question._id === activeQuestionId);
  }, [activeQuestionId, questions]);
  

  const activeQuestionNumber = useMemo(() => {
    return (
      questions.findIndex((question) => question._id === activeQuestionId) + 1
    );
  }, [activeQuestionId, questions]);

  const totalQuestions = useMemo(() => questions.length, [questions.length]);

   const values = useMemo(
    () => ({
      activeQuestion,
      activeQuestionNumber,
      totalQuestions,
      activeQuestionId,
      loading,
      isValidatingAnswer,
      isSubmittingQuiz,
      error,
    }),
    [
      activeQuestion,
      activeQuestionNumber,
      totalQuestions,
      activeQuestionId,
      loading,
      isValidatingAnswer,
      isSubmittingQuiz,
      error,
    ]
  );

  return values;
}

export default useQuestionState;
