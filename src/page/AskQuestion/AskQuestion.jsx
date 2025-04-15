import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyEditor from "../../components/MyEditor/MyEditor";
import "./AskQuestion.css";
import { askQuestion } from "../../actions/question";
import { toast } from "react-toastify";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import sendIcon from "../../components/assets/send.svg";
import Lottie from "lottie-react";
import ask from "../../components/assets/ask-question.json";


const AskQuestions = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isTitleFilled, setIsTitleFilled] = useState(false);
  const [isBodyFilled, setIsBodyFilled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const User = useSelector((state) => state.currentUser);

  const handleTitleChange = (e) => {
    setQuestionTitle(e.target.value);
    setIsTitleFilled(e.target.value.trim() !== "");
  };

  const handleBodyChange = (value) => {
    setQuestionBody(value);
    setIsBodyFilled(value.trim() !== "");
  };

  const handleTagChange = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault(); // Ngăn chặn hành động mặc định của phím
      if (currentTag.trim()) {
        setQuestionTags((prevTags) => [
          ...new Set([...prevTags, currentTag.trim()]),
        ]);
        setCurrentTag(""); // Reset giá trị thẻ hiện tại
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setQuestionTags((prevTags) =>
      prevTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionTitle || !questionBody || questionTags.length === 0) {
      toast.error(
        "Please fill out all fields before submitting your question."
      );
      return;
    }

    if (User) {
      dispatch(
        askQuestion(
          {
            title: questionTitle,
            body: questionBody,
            tags: questionTags.map((tag) => ({ name: tag })),
          },
          navigate
        )
      );
    } else {
      toast.error("You must be logged in to post a question.");
      console.log(questionTitle, questionBody, questionTags);
    }
  };

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2">
        <div className="ask-ques-container">
          <h1>Ask a Public Question</h1>
          <Lottie
                animationData={ask}
                style={{ width: "100%", height: "500px" }}
              />
          <form onSubmit={handleSubmit}>
            <div className="ask-form-container">
              <div className="each-label">
                <label htmlFor="ask-ques-title">
                  <h4>Title</h4>
                  <p>
                    Be specific and imagine you’re asking a question to another
                    person.
                  </p>
                  <input
                    type="text"
                    id="ask-ques-title"
                    value={questionTitle}
                    onChange={handleTitleChange}
                    placeholder="e.g., How to implement JWT authentication?"
                    className="input-field"
                  />
                </label>
              </div>
              {isTitleFilled && (
                <div className="each-label">
                  <label htmlFor="ask-ques-body">
                    <h4>What are the details of your problem?</h4>
                    <p>
                      Introduce the problem and expand on what you put in the
                      title. Minimum 20 characters.
                    </p>
                    <MyEditor
                      value={questionBody}
                      onChange={handleBodyChange}
                      placeholder="Write your question here..."
                      className="editor-field"
                    />
                  </label>
                </div>
              )}
              {isBodyFilled && (
                <div className="each-label">
                  <label htmlFor="ask-ques-tags">
                    <h4>Tags</h4>
                    <p>
                      Add up to 5 tags to describe what your question is about.
                      Start typing to see suggestions.
                    </p>
                    <div className="tags-container">
                      {questionTags.map((tag) => (
                        <div key={tag} className="tag">
                          {tag}
                          <span
                            onClick={() => handleRemoveTag(tag)}
                            className="remove-tag"
                          >
                            x
                          </span>
                        </div>
                      ))}
                      <input
                        type="text"
                        id="ask-ques-tags"
                        value={currentTag}
                        onChange={handleTagChange}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., react jwt nodejs"
                        className="input-field"
                      />
                    </div>
                  </label>
                </div>
              )}
              {isBodyFilled && (
                <button type="submit" className="btn-submit">
                  <div className="svg-wrapper-1">
                    <div className="svg-wrapper">
                      <img src={sendIcon} alt="" />
                    </div>
                  </div>
                  <span>Send</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestions;
