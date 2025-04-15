import React, { useState } from "react";
import "./Tags.css";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";

import Tags from "./Tags";

const TagList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2" style={{ marginTop: "30px" }}>
      <RightSidebar />
      <h1 style={{ fontWeight: "400" }}>Tags</h1>
        <p style={{ width: "70%" }}>
          A tag is a keyword or label that categorizes your question with other,
          similar questions. Using the right tags makes it easier for others to
          find and answer your question.
        </p>
        <input
          type="text"
          placeholder="Filter by tag"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            marginBottom: "20px",
            padding: "10px",
            width: "30%",
            borderRadius: "10px",
          }}
        />
        <Tags searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default TagList;
