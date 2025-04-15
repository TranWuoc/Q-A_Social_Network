import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommentsByAnswerId,
  createComment,
  deleteComment,
  updateComment,
} from "../../actions/comments";
import "./CommentSection.css"; // Import the CSS file
import MyEditor from "../../components/MyEditor/MyEditor";
 import ReactHtmlParser from "html-react-parser"; 

export const CommentsSection = ({ answerId, questionId }) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Lấy comments từ Redux store
  const comments = useSelector(
    (state) => state.comments.commentsByAnswerId[answerId] || [] // Lấy comments theo answerId
  );

  useEffect(() => {
    if (answerId && comments.length === 0) {
      dispatch(getCommentsByAnswerId(answerId)); // Gọi action chỉ khi chưa có comments
    }
  }, [dispatch, answerId, comments.length]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch(createComment(answerId, { content: newComment, questionId })); // Use questionId
      setNewComment("");
      setShowCommentBox(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId, answerId));
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = () => {
    if (editingContent.trim()) {
      dispatch(
        updateComment(editingCommentId, { content: editingContent, questionId })
      ); // Use questionId
      setEditingCommentId(null);
      setEditingContent("");
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.commentId} className="comment-item">
            {editingCommentId === comment.commentId ? (
              <div>
                <MyEditor
                  value={editingContent}
                  onChange={setEditingContent} // Cập nhật nội dung bình luận đang chỉnh sửa
                />
                <div className="comment-btn">
                <button
                  onClick={handleUpdateComment}
                  className="edit-comment-btn"
                  style={{ backgroundColor: "var(--green)" , color: "white"}}
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="cancel-comment-btn"
                >
                  Cancel
                </button>
                </div>
              </div>
            ) : (
              <>
                <p>{ReactHtmlParser(comment.content)}</p>
                <small className="comment-meta">
                  By {comment.username} on{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
                <button
                  className="edit-comment-btn"
                  onClick={() => handleEditComment(comment)}
                >
                  Edit
                </button>
                <button
                  className="delete-comment-btn"
                  onClick={() => handleDeleteComment(comment.commentId)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      {showCommentBox ? (
        <div className="add-comment-box">
          <MyEditor
            value={newComment}
            onChange={setNewComment} // Cập nhật nội dung bình luận mới
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment} className="add-comment-btn">
            Submit
          </button>
          <button
            onClick={() => setShowCommentBox(false)}
            className="cancel-comment-btn"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCommentBox(true)}
          className="show-comment-box-btn"
        >
          Add Comment
        </button>
      )}
    </div>
  );
};

export default CommentsSection;
