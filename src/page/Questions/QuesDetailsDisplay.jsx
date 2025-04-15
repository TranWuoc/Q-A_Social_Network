
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import copy from "copy-to-clipboard";
import openAI from "../../components/assets/openai.svg";
import Avatar from "../../components/Avatar/Avatar";
import DisplayAnswer from "./DisplayAnswer";
import {
  fetchQuestionDetails,
  voteQuestion,
  deleteQuestion,
  addViewToQuestion,
  fetchAIExplanation,
} from "../../actions/question";
import { getCommentsByQuestionId } from "../../actions/comments";
import {
  handlePostAnswerAction,
  fetchAnswersByQuestionId,
} from "../../actions/answers";
import { toast } from "react-toastify";
import ReactHtmlParser from "html-react-parser";
import MyEditor from "../../components/MyEditor/MyEditor";
import CommentsSection from "../../components/Comment/CommentSection";
import "./EditQuestion.css";

const QuesDetailsDisplay = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerBody, setAnswerBody] = useState("");
  const [aiExplanation, setAIExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser);
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const url = "http://localhost:3000";
  const hasFetched = useRef(false); // Track whether the fetch has already occurred

  useEffect(() => {
    const loadQuestionDetails = async () => {
      if (hasFetched.current) return; // Prevent re-execution
      hasFetched.current = true;
      setQuestion(null); // Clear previous question state
      try {
        const questionData = await fetchQuestionDetails(id);
        setQuestion(questionData);
        setAnswers(questionData.answers || []);
        dispatch(getCommentsByQuestionId(id));
      } catch (error) {
        toast.error("Failed to fetch question details. Please try again later.");
        navigate("/Questions");
      }
    };

    loadQuestionDetails();
  }, [id, dispatch, navigate]);
  useEffect(() => {
    const addView = async () => {
      try {
        const viewedQuestions = JSON.parse(sessionStorage.getItem("viewedQuestions")) || [];
  
        // Ensure question data is loaded before checking ownership
        if (question.userId === userId) {
          console.log("Cannot add view: This question belongs to the user.");
          return;
        }
  
        // Check if the question has already been viewed
        if (!viewedQuestions.includes(id)) {
          // Add view to the question
          await addViewToQuestion(id);
  
          // Add question ID to the viewed questions list
          viewedQuestions.push(id);
          sessionStorage.setItem("viewedQuestions", JSON.stringify(viewedQuestions));
  
          console.log("View added to the question.");
        } else {
          console.log("View already added for this question.");
        }
      } catch (error) {
        console.error("Error adding view to question:", error);
      }
    };
  
    addView();
  }, [id, question, userId]);
  
useEffect(() => {
  const loadQuestionAndAnswers = async () => {
    try {
      const questionData = await fetchQuestionDetails(id);
      setQuestion(questionData);
      const answersData = await fetchAnswersByQuestionId(id);
      setAnswers(answersData);
      console.log("Answers:", answersData);
    } catch (error) {
      console.error("Error loading question or answers:", error);
    }
  };

  loadQuestionAndAnswers();
}, [id]);
 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!answerBody) return alert("Answer cannot be empty");
  if (userId === question.userId) {
    toast.error("Tự hỏi tự trả lời luôn mà");
    return;
  }
    
   try {
     const newAnswer = await dispatch(
       handlePostAnswerAction(
         id,
         answerBody,
         user?.result?._id,
         user?.result?.username
       )
     );
     setAnswers([...answers, newAnswer]);
     setAnswerBody("");
   } catch (error) {
     console.error("Error posting answer:", error);
   }
 };

  const handleShare = () => {
    copy(url + location.pathname);
    toast.success("Copied URL: " + url + location.pathname, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleUpvote = async () => {
    if (!user) {
      toast.error("You need to log in to vote.");
      return;
    }
  
    try {
      await voteQuestion(id, "upVote", userId, setQuestion);
    } catch (error) {
      console.error("Error during upvote:", error);
    }
  };
  
  const handleDownvote = async () => {
    if (!user) {
      toast.error("You need to log in to vote.");
      return;
    }
  
    try {
      await voteQuestion(id, "downVote", userId, setQuestion);
    } catch (error) {
      console.error("Error during downvote:", error);
    }
  };
  

  const handleDelete = (questionId, noOfAnswers) => {
    if (userId!== question.userId) {
      toast.error("You are not the owner of this question.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this answer?"
    );
    if (confirmDelete) {
      dispatch(deleteQuestion(id, questionId, noOfAnswers));
      navigate("/");
      toast.success("Question deleted successfully!");
    }
  };

  if (!question) {
    return <div>Loading...</div>;
  }
  const handleFetchAIExplaination = async () => {
    if (!question) return;

    setLoading(true); // Bật spinner
    setAIExplanation(""); // Reset kết quả AI
    try {
      // Nối cả title và body thành chuỗi
      const prompt = `${question.title}. ${question.body}`;
      const response = await fetchAIExplanation(prompt); // Gửi cả title và body đến API
      setAIExplanation(response); // Lưu kết quả từ AI
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false); // Tắt spinner
    }
  };

  

  return (
    <div className="question-details-page">
      <section className="question-details-container">
        <h1>{question.title}</h1>
        <div className="question-details-container-2">
          <div className="question-votes">
            <button
              type="votes"
              className="btn-votes"
              onClick={handleUpvote}
              disabled={!question}
            >
              <div className="arrow-up"></div>
            </button>
            <p>{question?.score ?? 0}</p> {/* Safely access score */}
            <button
              type="votes"
              className="btn-votes"
              onClick={handleDownvote}
              disabled={!question}
            >
              <div className="arrow-down"></div>
            </button>
          </div>

          <div style={{ width: "100%" }}>
            <div className="question-body">
              {ReactHtmlParser(question.body)}
            </div>
            <div className="question-details-tags">
              {question.tags.map((tag) => (
                <p key={tag.tagId}>{tag.name}</p>
              ))}
            </div>
            <div className="question-actions-user">
              <div>
                {/* Nút Share luôn hiển thị */}
                <button type="button" onClick={handleShare}>
                  Share
                  <span className="tooltip">
                    Short permalink to this question
                  </span>
                </button>
                {/* Chỉ hiển thị Delete và Edit nếu user là chủ sở hữu của câu hỏi */}
                {userId === question?.userId && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(question.answerId, question.noOfAnswers)
                      }
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/Questions/${id}/edit`)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <div>
                <p>asked {moment(question.createdAt).fromNow()}</p>
                <Link
                  to={`/Users`}
                  className="user-link"
                  style={{ color: "#00086d8" }}
                >
                  <Avatar
                    backgroundColor="var(--primary-color)"
                    px="8px"
                    py="5px"
                  >
                    {question.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>{question.username}</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="question-details-container">
        <div className="ai-explanation-container">
          <div className="button-container">
            {userId === question?.userId && (
              <button
                className="brutalist-button openai button-1"
                onClick={handleFetchAIExplaination}
                disabled={loading}
              >
                <div className="openai-logo">
                  <img src={openAI} alt="OpenAI" className="openai-icon" />
                </div>
                <div className="button-text">
                  <span>Get AI </span>
                  <span>Explanation</span>
                </div>
                {loading ? "Loading AI Response..." : ""}
              </button>
            )}
          </div>
          {loading && (
            <div className="hourglassBackground">
              <div className="hourglassContainer">
                <div className="hourglassCurves"></div>
                <div className="hourglassCapTop"></div>
                <div className="hourglassGlassTop"></div>
                <div className="hourglassSand"></div>
                <div className="hourglassSandStream"></div>
                <div className="hourglassCapBottom"></div>
                <div className="hourglassGlass"></div>
              </div>
            </div>
          )}{" "}
          {aiExplanation && (
            <div className="ai-explanation">
              <h3>AI Explanation:</h3>
              <div dangerouslySetInnerHTML={{ __html: aiExplanation }} />{" "}
            </div>
          )}
        </div>
      </div>
      {user && <CommentsSection questionId={id} />}

      {answers.length > 0 && (
        <section>
          <h3>
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h3>
          <DisplayAnswer
            question={question}
            answers={answers}
            handleShare={handleShare}
          />
        </section>
      )}

      {user && ( // Only render this section if user is not null
        <section className="post-ans-container">
          <h3>Your Answer</h3>
          <form onSubmit={handleSubmit}>
            <MyEditor value={answerBody} onChange={setAnswerBody} />
            <br />
            <input
              type="submit"
              className="post-ans-btn"
              value="Post your Answer"
            />
          </form>
          <p>
            Browse other questions tagged
            {question.tags.map((tag) => (
              <Link to="/Tags" key={tag.tagId} className="ans-tags">
                {tag.name}
              </Link>
            ))}
            or{" "}
            <Link to="/AskQuestion" style={{ textDecoration: "none" }}>
              ask your own question.
            </Link>
          </p>
        </section>
      )}
    </div>
  );
};

export default QuesDetailsDisplay;
