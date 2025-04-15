import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { fetchAnswersByQuestionId } from "../../actions/answers"; 
import ReactHtmlParser from "html-react-parser"; 

const QuestionItem = ({ question }) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const getAnswers = async () => {
      try {
        const fetchedAnswers = await fetchAnswersByQuestionId(
          question.questionId
        );
        setAnswers(fetchedAnswers);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

    getAnswers();
  }, [question.questionId]);

  return (
    <div className="display-question-container">
      <div className="display-votes-ans">
        <p style={{ fontWeight: question.score !== 0 ? "bold" : "normal", color: question.score < 0 ? "red" : "black" }}>
          {question.score || 0} {question.score === 1 || question.score === -1 ? "vote" : "votes"}
        </p>
        <p style={{ color: question.view !== 0 ? "black" : "grey" }}>
          {question.view || 0} {question.view === 1 ? "view" : "views"}
        </p>
        <div>
        <p
        style={{
          backgroundColor: question.acceptedAnswerId ? "rgb(23, 134, 75)" : "transparent",
          color: question.acceptedAnswerId ? "white" : answers.length >= 1 ? "green" : "black",
          border: answers.length >= 1 ? "1px solid green" : "none",
          padding: answers.length >= 1 || question.acceptedAnswerId ? "5px" : "0",
          borderRadius: answers.length >= 1 || question.acceptedAnswerId ? "5px" : "0",
        }}
      >
        {question.acceptedAnswerId && (
          <span
            style={{
              marginRight: "5px",
              fontWeight: "bold",
            }}
          >
            ✓
          </span>
        )}
            {answers.length === 0
              ? "No answers"
              : `${answers.length} ${
                  answers.length === 1 ? "answer" : "answers"
                }`}{" "}
          </p>
        </div>
      </div>
      <div className="display-question-details">
        <NavLink
          style={{ textDecoration: "none", fontSize: "17px" }}
          to={`/Questions/${question.questionId}`}
        >
          {question.title}
        </NavLink>
        <div className="question-body">
          {/* Kiểm tra nội dung của question.body */}
          {ReactHtmlParser(question.body.substring(0, 20) + "...")}
        </div>
        <div className="display-tags-time">
          <div className="display-tags">
            {question.tags.map((tag) => (
              <span key={tag.tagId} className="tag">{tag.name}</span> // Đã thay đổi <p> thành <span>
            ))}
          </div>
          <p className="display-time">
            asked {moment(question.createdAt).fromNow()} by {question.username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;