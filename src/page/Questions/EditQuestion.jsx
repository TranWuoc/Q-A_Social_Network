import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestionDetails, updateQuestion } from "../../actions/question";
import { toast } from "react-toastify";
import MyEditor from "../../components/MyEditor/MyEditor";
import "./EditQuestion.css"; // Import the CSS file

const EditQuestion = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestionDetails = async () => {
      try {
        const questionData = await fetchQuestionDetails(id);
        setTitle(questionData.title);
        setBody(questionData.body);
        setTags(questionData.tags.map((tag) => tag.name));
      } catch (error) {
        console.error("Error loading question details:", error);
      }
    };

    loadQuestionDetails();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Kiểm tra chiều dài của body
    if (body.replace(/<[^>]*>/g, "").trim().length < 20) {
      toast.error("Body must be at least 20 characters long.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      return;
    }
  
    // Kiểm tra ít nhất một thẻ đã được nhập
    if (tags.length === 0) {
      toast.error("Please add at least one tag before submitting your question.");
      return;
    }
  
    const uniqueTags = [...new Set(tags.map(tag => tag.trim()).filter(tag => tag))];
    const updatedData = {
      title,
      body,
      acceptedAnswerId: "", // Giữ "" nếu không có giá trị
      tags: uniqueTags.map(tag => ({ name: tag })),
    };
    console.log(updatedData);
    console.log("Updating question with ID:", id, updatedData);
    
    try {
      await updateQuestion(id, updatedData, (updatedQuestion) => {
        navigate((`/Questions/${id}`), { replace: true });
      });
    } catch (error) {
      toast.error("Failed to update question. Try again.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      console.error("Error updating question:", error);
    }
  };

  const handleTagChange = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault(); // Ngăn chặn hành động mặc định của phím
      if (currentTag.trim()) {
        setTags((prevTags) => [
          ...new Set([...prevTags, currentTag.trim()]),
        ]);
        setCurrentTag(""); // Reset giá trị thẻ hiện tại
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="home-container-1">
    <div className="home-container-2">

    <div className="edit-question-page">
      <h1>Edit Question</h1>
      <form onSubmit={handleUpdate}>
        <label>
          <h3>Title</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          <h3>Body</h3>
          <MyEditor value={body} onChange={setBody} />
        </label>
        <label>
          <h3>Tags</h3>
          <div className="tags-container">
            {tags.map((tag) => (
              <div key={tag} className="tag">
                {tag}
                <span onClick={() => handleRemoveTag(tag)} className="remove-tag">x</span>
              </div>
            ))}
            <input
              type="text"
              value={currentTag}
              onChange={handleTagChange}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag and press space or enter"
            />
          </div>
        </label>
        <button type="submit" className="update-btn">Update Question</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default EditQuestion;