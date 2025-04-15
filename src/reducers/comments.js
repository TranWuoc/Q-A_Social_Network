const initialState = {
  comments: [],
  commentsByAnswerId: {}, // Empty object to store comments for each answerId
  commentsByQuestionId: {},
  error: null,
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_COMMENT':
      return {
        ...state,
        comments: [...state.comments, action.payload], // Thêm comment vào mảng
      };
      case 'FETCH_COMMENTS_SUCCESS':
        return {
          ...state,
          commentsByQuestionId: {
            ...state.commentsByQuestionId,
            [action.payload.questionId]: action.payload.comments,
          },
        };
    case 'GET_COMMENTS':
      // Use the answerId to map the comments to the correct answerId in the state
      return {
        ...state,
        commentsByAnswerId: {
          ...state.commentsByAnswerId,
          [action.payload.answerId]: action.payload.comments, // Store comments by answerId
        },
        commentsByQuestion: {
          ...state.commentsByQuestionId,
          [action.payload.questionId]: action.payload.comments, // Save comments under questionId
        },
      };
      case "SET_COMMENTS":
        return {
          ...state,
          commentsByQuestionId: {
            ...state.commentsByQuestionId,
            [action.payload.questionId]: action.payload.comments,
          },
        };
    case 'COMMENTS_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default commentsReducer;
