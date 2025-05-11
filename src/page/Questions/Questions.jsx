import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import "../../App.css";
import "react-toastify/dist/ReactToastify.css";
import QuestionList from "../../components/HomeMainbar/QuestionList";
import "./Questions.css";
import questionMark from "../../components/assets/questionMark.svg";
import Pagination from "../../page/Users/Pagination";
import Lottie from "lottie-react";
import questionAnim from "../../components/assets/question-anim.json";
const Questions = () => {
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch questions from the API
        const response = await axiosClient.get("/questions/getAll", {
          params: { page, size },
        });
        if (
          response &&
          response.data &&
          response.data.result &&
          Array.isArray(response.data.result.data)
        ) {
          setQuestions(response.data.result.data);
        } else {
          console.error("No questions found");
          setQuestions([]);
        }
        setTotalPages(response.data.result.totalPages);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [page, size]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Filter questions to show only those with no upvoted or accepted answers
  const filteredQuestions = questions.filter((question) => {
    if (question.answers && question.answers.length > 0) {
      return !question.answers.some(
        (answer) => answer.upvotes > 0 || answer.isAccepted
      );
    }
    return true;
  });

  const redirectToAskQuestion = () => {
    if (userId === null) {
      toast.error("You need to log in to post a question.");
    } else {
      navigate("/AskQuestion");
    }
  };

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2">
        {/* <ToastContainer /> */}
        <div className="main-bar1">
          <div className="question-bar-header">
            {location.pathname === "/" ? (
              <h1>Top Questions</h1>
            ) : (
              <h1>Questions</h1>
            )}
            <button className="ask-btn-1" onClick={redirectToAskQuestion}>
              <img src={questionMark} alt="Question Mark" width="20px" />
            </button>
          </div>
          <div>
            <div className="lottie-container">
              <Lottie
                animationData={questionAnim}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            {questions.length === 0 ? (
              <h1>Loading...</h1>
            ) : (
              <>
                <div className="main-bar-header2">
                  <div style={{ display: "flex" }}>
                    <div>
                      <p>
                        {filteredQuestions.length} questions with no <br />
                        upvoted or accepted answers
                      </p>
                    </div>
                    <div className="mainbar-header-buttons">
                      <Link>
                        <button className="btn-mainbar-header">New</button>
                      </Link>
                      <Link>
                        <button className="btn-mainbar-header">Active</button>
                      </Link>
                      <Link>
                        <button className="btn-mainbar-header">Bountied</button>
                      </Link>
                      <Link>
                        <button className="btn-mainbar-header">
                          Unanswered
                        </button>
                      </Link>
                      <Link>
                        <button className="btn-mainbar-header">More</button>
                      </Link>
                      <Link>
                        <button className="btn-mainbar-header">Filter</button>
                      </Link>
                    </div>
                  </div>
                </div>
                <hr style={{ width: "100%", marginLeft: "0" }} />
                <QuestionList questionsList={filteredQuestions} />
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Questions;
