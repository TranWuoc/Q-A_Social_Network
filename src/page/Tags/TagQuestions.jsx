import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import QuestionList from "../../components/HomeMainbar/QuestionList";
import Pagination from "../../page/Users/Pagination";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
const TagQuestions = () => {
  const { tagId, tagName } = useParams(); // Lấy tagId và tagName từ URL
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchQuestionsByTag = async () => {
      try {
        const response = await axiosClient.get(
          `/questions/getQuestionsByTag/${tagId}`
        );
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
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsByTag();
  }, [tagId, page, size]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2">
        <div className="question-bar-header"></div>
        <div className="main-bar">
          <h1>{tagName}</h1>
          {questions.length === 0 ? (
            <h1>No questions found for this tag.</h1>
          ) : (
            <>
              <div className="main-bar-header2">
                <div style={{ display: "flex" }}>
                  <div>
                  </div>
                  <div className="mainbar-header-buttons">
                    <Link to="/New">
                      <button className="btn-mainbar-header">New</button>
                    </Link>
                    <Link to="/Active">
                      <button className="btn-mainbar-header">Active</button>
                    </Link>
                    <Link to="/Bountied">
                      <button className="btn-mainbar-header">Bountied</button>
                    </Link>
                    <Link to="/Unanswered">
                      <button className="btn-mainbar-header">Unanswered</button>
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
              <QuestionList questionsList={questions} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </>
          )}
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default TagQuestions;
