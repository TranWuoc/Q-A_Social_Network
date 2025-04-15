import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./HomeMainbar.css";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import Handwave from "../../components/assets/handwave.svg";
import Lottie from "lottie-react";
import coding from "../../components/assets/coding.json";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import { signUp } from "../../actions/auth";
import ab from "../../components/assets/3d.png";
import questionMark from "../../components/assets/questionMark.svg";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const HomeMainbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userQuestions, setUserQuestions] = useState([]);
  const userData = {
    username: name,
    email: email,
    passwordRaw: password,
    location: "",
    aboutMe: "",
    slogan: "",
    reputation: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setIsLoggedIn(true);
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername || "User");

      axiosClient
        .get(`questions/getQuestionsByUser?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (
            response.data &&
            response.data.result &&
            response.data.result.data
          ) {
            const filteredQuestions = response.data.result.data.filter(
              (question) => !question.deleted
            );
            setUserQuestions(filteredQuestions);
          } else {
            console.warn("Unexpected response structure:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching user questions:", error);
        });
    } else {
      setIsLoggedIn(false);
    }

    if (location.state?.registered) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Please fill in all fields!");
      return;
    }
    // Call the sign-up action
    dispatch(signUp(userData, navigate));
  };
  return (
    <div>
      <RightSidebar />

      <div className="main-bar">
        {isLoggedIn ? (
          <div>
            <div className="main-bar-header">
              <img src={Handwave} alt="Hand Wave" width="70px" />
              <div className="main-bar-header2">
                <h1>Welcome to Stack Overflow, {username}!</h1>
                <span style={{ opacity: 0.5 }}>
                  Find answers to your technical questions and help others
                  answer theirs.
                </span>
              </div>
              <button
                className="ask-button"
                onClick={() => navigate("/AskQuestion")}
              >
                <img src={questionMark} alt="Question Mark" width="20px" />
              </button>
            </div>

            <div style={{ marginTop: "30px" }}>
              <div className="info-container">
                <div className="container-item">
                  <h2>Your Posted Questions</h2>
                  <ul className="user-questions-list">
                    {userQuestions.length > 0 ? (
                      userQuestions.map((question) => (
                        <li key={question.questionId} className="question-item">
                          <a
                            href={`/Questions/${question.questionId}`}
                            className="question-title-link"
                          >
                            {question.title}
                          </a>
                        </li>
                      ))
                    ) : (
                      <p>You haven't posted any questions yet.</p>
                    )}
                  </ul>
                </div>
                {/* Additional content here... */}
              </div>
            </div>
          </div>
        ) : (
          <div className="not-logged-in-container">
            <div className="lottie-container">
              <Lottie
                animationData={coding}
                style={{ width: "100%", height: "100%" }}
              />
              <h1>Welcome to Stack Overflow!</h1>
              <p>
                Join millions of developers around the world to ask, learn, and
                share technical knowledge.
              </p>
              <p>
                From beginners to experts, we've got something for everyone.
              </p>
            </div>

            {/* Hero Section for Unauthenticated Users */}
            <header className="hero-container">
              <div className="hero-text">
                <h1>
                  Every <span className="developer-highlight">developer</span>{" "}
                  has a<br /> tab open to Stack Overflow.
                </h1>
                <p>
                  For over 21 years we’ve been the Q&A platform of choice that
                  millions of people visit every month to ask questions, learn,
                  and share technical knowledge.
                </p>
              </div>
              <div className="hero-image">
                <img src={ab} alt="Stack Overflow Hero" />
              </div>
            </header>

            <form className="form" onSubmit={handleSignUp}>
              <header>
                Account information
                <span className="message">Fill the form to continue.</span>
              </header>
              <label>
                <span>Display name</span>
                <input
                  placeholder="Type your display name"
                  className="input"
                  type="text"
                  required onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  placeholder="Type your email address"
                  className="input"
                  type="email"
                  required onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <fieldset>
                  <span>Password</span>
                  <input
                    placeholder="Type your password"
                    className="input"
                    type="password"
                    required  onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
              </label>
                <button>Submit</button>
            </form>
            <button className="join-button" onClick={() => navigate("/Auth")}>
              <FontAwesomeIcon
                icon={faSignInAlt}
                style={{ marginRight: "8px" }}
              />
              Join Us
            </button>
            <p className="small-note">
              Already a member?{" "}
              <button className="link-button" onClick={() => navigate("/Auth")}>
                Sign In
              </button>
            </p>
           
            {/* Existing Not Logged In Content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeMainbar;
