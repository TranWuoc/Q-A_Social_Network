// QuestionList.jsx
import React from 'react';
import QuestionItem from './QuestionItem';
const QuestionList = ({ questionsList }) => {
  return (
    <div className="question-list">
      {questionsList.map((question) => (
        <QuestionItem key={question.questionId} question={question} />
      ))}
    </div>
  );
};

export default QuestionList;