import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import Pagination from "../../page/Users/Pagination"; // Import component
import ReactHtmlParser from "html-react-parser";
import "./SearchResult.css";

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        console.log("Sending API request with query:", query);

        const response = await axiosClient.get(
          `questions/getQuestionsByConditions`,
          {
            params: {
              page: currentPage, // Use current page
              size: 5, // Set the number of items per page
              type: 0, // Type filter (if needed)
              keyword: query, // Pass the keyword as search query
            },
          }
        );

        console.log("API Response:", response);

        if (response.data.result && response.data.result.data) {
          setResults(response.data.result.data);

          // Set total pages if available
          setTotalPages(response.data.result.totalPages || 0); // Adjust based on your API response
        } else {
          setResults([]); // If no results, set empty array
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query, currentPage]); // Re-run the effect when `query` or `currentPage` changes

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2" style={{ marginTop: "30px" }}>
        <h2>Search Results for "{query}"</h2>
        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          <div>
            <ul className="search-results-list">
              {results.map((question) => (
                <li key={question.questionId} className="search-result-item">
                  <h3>
                    <Link to={`/Questions/${question.questionId}`}>
                      {question.title || "No Title"}
                    </Link>
                  </h3>
                  <p>{ReactHtmlParser(question.body) || "No Body Available"}</p>
                  <p>Username: {question.username}</p>
                  <p>Tags: {question.tags.map((tag) => tag.name).join(", ")}</p>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange} // Pass handler to Pagination component
            />
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
