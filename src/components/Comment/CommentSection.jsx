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
import socket from "../../utils/socket";

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

  // Join room
  useEffect(() => {
    
      socket.emit("join-room", questionId);
    
  
    return () => {
      socket.emit("leave-room", questionId);
    };
  }, [questionId]);


  // On receive comment (Socket)
  useEffect(() => {
    const handleNewComment = (comment) => {
      console.log("hùnggggggggggggggggggggggg")
      console.log(comment);
      // Nếu comment nhận được thuộc về đúng answer đang xem
      if (comment.answerId === answerId) {
        dispatch({
          type: "NEW_COMMENT_RECEIVED",
          payload: comment,
        });
      }
    };
  
    socket.on("receive-comment", handleNewComment);
  
    return () => {
      socket.off("receive-comment", handleNewComment);
    };
  }, [answerId, dispatch]);

  // On update comment (Socket)
  useEffect(() => {
    const handleUpdatedComment = (updatedComment) => {
      dispatch({
        type: "COMMENT_UPDATED",
        payload: updatedComment,
      });
    };
  
    socket.on("receive-updated-comment", handleUpdatedComment);
  
    return () => {
      socket.off("receive-updated-comment", handleUpdatedComment);
    };
  }, [dispatch]);

  // On delete comment (Socket)
  useEffect(() => {
    const handleDeletedComment = ({ commentId, answerId }) => {
      dispatch({
        type: "COMMENT_DELETED",
        payload: { commentId, answerId },
      });
    };
  
    socket.on("receive-deleted-comment", handleDeletedComment);
  
    return () => {
      socket.off("receive-deleted-comment", handleDeletedComment);
    };
  }, [dispatch]);


  const handleAddComment = async () => {
    if (newComment.trim()) {

      const createdComment = await dispatch(createComment(answerId, { content: newComment, questionId })); // Use questionId

      socket.emit("send-comment", createdComment);

      setNewComment("");
      setShowCommentBox(false);
    }
  };

  const handleUpdateComment = async () => {
    if (editingContent.trim()) {
      const updatedComment = await dispatch(
        updateComment(editingCommentId, { content: editingContent, questionId })
      ); // Use questionId

      socket.emit("update-comment", updatedComment);

      setEditingCommentId(null);
      setEditingContent("");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const deletedComment = await dispatch(deleteComment(commentId, answerId));
    socket.emit("delete-comment", deletedComment);

  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditingContent(comment.content);
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
