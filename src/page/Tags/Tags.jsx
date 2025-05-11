import React, { useEffect, useState } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import "./Tags.css";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import Pagination from "../Users/Pagination";
const Tags = ({ searchTerm }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalTags, setTotalTags] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // State cho tổng số trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Fetch tags from the API
        const response = await axiosClient.get("/questions/getAllTag", {
          params: { page, size },
        }); 
        const tagsArray = Array.isArray(response.data.result.data)
          ? response.data.result.data
          : [];

        setTotalTags(response.data.result.totalElements);
        setTotalPages(response.data.result.totalPages);
        setTags(tagsArray);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchTags();
  }, [page, size]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const filteredTags = tags.filter((tag) => tag.name.includes(searchTerm));

  const tagElements = filteredTags.map((data) => {
    const handleClick = () => {
      navigate(`/TagQuestions/${data.name}/${data.tagId}`, {
        state: { tag: data },
      });
    };

    return (
      
      <div key={data.tagId} class="card-tags" onClick={handleClick}>
        <strong>
          {data.name}
        </strong>
        <div class="card__body"></div>
        <span>Watch Tag</span>
      </div>
    );
  });
  return (
    <div>
      <div className="tags-list-container">{tagElements}</div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Tags;
