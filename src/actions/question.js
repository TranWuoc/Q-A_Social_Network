import axiosClient from '../api/axiosClient';
import { toast } from "react-toastify";

export const fetchQuestionDetails = async (id) => {
  try {
    const response = await axiosClient.get(`/questions/getQuestionsByConditions?questionId=${id}`);
    console.log("Response from fetchQuestionDetails:", response.data);
    if (response.data && response.data.result && response.data.result.data.length > 0) {
      const question = response.data.result.data.find(q => q.questionId === id);
      if (question) {
        return question;
      }
    } 
  } catch (error) {
    console.error("Error fetching question details:", error);
    throw error;
  }
};
export const addViewToQuestion = async (id) => {
  try {
    const response = await axiosClient.post(`/questions/addView/${id}`);
  } catch (error) {
    console.error("Error in addViewToQuestion function:", error);
    throw error;
  }
};
export const voteQuestion = async (id, type, userId, setQuestion = null) => {
  try {
    // Determine the endpoint dynamically based on the vote type
    const endpoint = `/votes/question/${type === "upVote" ? "upvote" : "downvote"}/${id}`;

    // Perform the voting action
    const response = await axiosClient.post(endpoint, { userId });

    // Display success toast
    toast.success(`Question ${type === "upVote" ? "upvoted" : "downvoted"} successfully!`);

    // If setQuestion is provided, fetch updated question details and update state
    if (setQuestion) {
      const updatedQuestion = await fetchQuestionDetails(id);
      setQuestion(updatedQuestion);
    }

    return response.data.result; // Return updated vote details
  } catch (error) {
    console.error(`Error ${type === "upVote" ? "upvoting" : "downvoting"} question:`, error);
    throw error;
  }
};

  export const askQuestion = (questionData, navigate) => async (dispatch) => {
    try {
      const response = await axiosClient.post("/questions/create", questionData, {
       
      });
      console.log("Question Posted:", response.data);
      // Nếu thành công, điều hướng đến trang hiển thị câu hỏi hoặc thông báo
      toast.success("Question posted successfully!");
      navigate(`/Questions/${response.data.result.questionId}`);
    } catch (error) {
      console.error("Error posting question:", error);
      // alert("You need to log in to post a question.");
      // navigate("/Auth");
    }
  };

export const deleteQuestion = (questionId, noOfAnswers) => async (dispatch) => {
  try {
    const response = await axiosClient.delete(`/questions/delete/${questionId}`);
    console.log("Deleted question response:", response);

    // Cập nhật danh sách câu hỏi hoặc làm mới thông tin
  } catch (error) {
    console.error("Error deleting question:", error);

  }
};

export const updateQuestion = async (quesId, updatedData, setQuestion) => {
  try {
    const response = await axiosClient.put(`/questions/update/${quesId}`, {
      ...updatedData,
      acceptedAnswerId: updatedData.acceptedAnswerId || "", // Truyền giá trị rỗng nếu không có
    });

    if (response.data && response.data.result) {
      toast.success("Question updated successfully!");
      setQuestion(response.data.result); // Cập nhật giao diện
    }
  } catch (error) {
    console.error("Error updating question:", error);
    if (error.response && error.response.data.message) {
      console.log("Response data:", error.response.data);
      console.log("Status code:", error.response.status);
      console.log("Headers:", error.response.headers);
    } else {
      toast.error("Error updating question");
    }
  }
};

export const acceptAnswer = async (questionId, answerId, questionState, setQuestion) => {
  try {
    // Cập nhật acceptedAnswerId trong dữ liệu câu hỏi hiện tại
    const updatedData = {
      title: questionState.title,
      body: questionState.body,
      tags: questionState.tags,  // Giữ nguyên các tag
      acceptedAnswerId: answerId,  // Chỉ cập nhật acceptedAnswerId
    };

    console.log("Updating with data:", updatedData);  // In ra dữ liệu gửi đi để debug

    // Gọi API để cập nhật acceptedAnswerId cùng các thông tin câu hỏi
    const response = await axiosClient.put(`/questions/update/${questionId}`, updatedData);

    if (response.data && response.data.result) {
      toast.success("Answer accepted successfully!");
      setQuestion(response.data.result); // Cập nhật câu hỏi trong giao diện
    }
  } catch (error) {
    console.error("Error accepting answer:", error);
    if (error.response && error.response.data.message) {
      console.log("Response data:", error.response.data);
    } else {
      throw error;
    }
  }
};

export const fetchAIExplanation = async (body) => {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_GOOGLE_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
      },
    });

    // Loại bỏ thẻ <p> và </p> từ body
    const cleanBody = body.replace(/<\/?p>/g, "");
    const prompt = cleanBody + ". Trả về kết quả là định dạng text/plain";

    const result = await model.generateContent(prompt);

    // Kiểm tra response trước khi xử lý
    if (!result.response || typeof result.response.text !== 'function') {
      console.error("API response is invalid:", result);
      throw new Error("Invalid API response: Missing 'response.text'");
    }

    // Gọi phương thức text() để lấy nội dung
    const responseText = await result.response.text(); // Đảm bảo gọi phương thức

    const formattedResult = responseText
      .replace(/\*/g, "") // Loại bỏ dấu *
      .replace(/<br\/>/g, "\n") // Thay thế thẻ <br/> bằng xuống dòng
      .replace(/##/g, "**")
      .replace(/\n/g, "<br/>") // Thay đổi xuống dòng thành thẻ HTML
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // In đậm từ markdown **text**
      .replace(/\*(.*?)\*/g, "<i>$1</i>") // In nghiêng từ markdown *text*
      .split("<br/>") // Tách văn bản thành từng đoạn
      .map((line) => `<p>${line.trim()}</p>`) // Thêm thẻ <p> cho từng đoạn
      .join(""); // Ghép lại thành chuỗi HTML

    // console.log("Formatted Result:", formattedResult);
    return formattedResult;
  } catch (error) {
    console.error("Error accepting answer:", error.response?.data || error.message);
    throw error; // Ném lỗi để xử lý sau này nếu cần
  }
};
