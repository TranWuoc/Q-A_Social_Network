const currentUserReducer = (state = {}, action) => {
  switch (action.type) {
    case "FETCH_CURRENT_USER":
      return { ...state, ...action.payload }; // Thêm payload vào state hiện tại
    case "LOGOUT":
      return {}; // Reset state về object rỗng khi logout
    default:
      return state;
  }
};

export default currentUserReducer;
