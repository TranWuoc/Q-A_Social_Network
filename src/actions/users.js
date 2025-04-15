// src/actions/users.js
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify'; // Nhập toast nếu bạn muốn thông báo

export const setUserInfo = (userInfo) => ({
  type: "SET_USER_INFO",
  payload: userInfo,
});

// Action to update user profile
export const updateUserProfile = (userId, profileData) => async (dispatch) => {
  try {
    // Kiểm tra dữ liệu trước khi gửi
    if (!profileData.username || !profileData.aboutMe) {
      throw new Error("Username and About Me are required.");
    }

    // Gọi API để cập nhật thông tin người dùng
    const response = await axiosClient.put(`/users/update/${userId}`, profileData);
    
    // Kiểm tra phản hồi từ server
    if (response && response.data) {
      // Dispatch action để cập nhật thông tin người dùng trong store
      dispatch(setUserInfo(response.data.result)); // Đảm bảo rằng response chứa dữ liệu cần thiết
      console.log("Updated user data:", response.data.result);

      return response.data.result; // Tùy chọn: trả về dữ liệu người dùng đã cập nhật
    } else {
      toast.error("Failed to update profile: No response data.");
    }
  } catch (error) {
    // Xử lý lỗi
    console.error("Error updating profile:", error);

    if (error.response) {
      // Nếu có phản hồi từ server
      toast.error(`Error: ${error.response.data.message || "Failed to update profile."}`);
    } else if (error.request) {
      // Nếu không có phản hồi
      toast.error("No response from server. Please try again later.");
    } else {
      // Lỗi khác
      toast.error(`An error occurred: ${error.message}`);
    }
  }
};