import React, { useEffect, useState } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import moment from "moment";
import { useParams, useNavigate,  } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {
  faCake,
  faUserPen,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import "./UserProfile.css";
import MyEditor from "../../components/MyEditor/MyEditor";
import { updateUserProfile } from "../../actions/users"; // Import hàm updateUserProfile
import { useDispatch } from "react-redux";
import ReactHtmlParser from "html-react-parser";
import icon from "../../components/assets/account-avatar-profile-user-7-svgrepo-com.svg";
import Gold from "../../components/assets/goldbadge.svg";
import Silver from "../../components/assets/silverbadge.svg";
import Bronze from "../../components/assets/bronzebadge.svg";
import "./cardbadge.css";
import "./Summary.css";
import repution from "../../components/assets/icon/reputionic.svg";
import answer from "../../components/assets/icon/answeric.svg";
import question from "../../components/assets/icon/question.svg";
const UserProfile = () => {
  const { id } = useParams();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // Mặc định là tab profile
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Form Edit here
  const [aboutmeBody, setAboutMeBody] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [slogan, setSlogan] = useState("");
  const [reputation, setReputation] = useState("");
  const [badges, setBadges] = useState("");
  const [roles, setRoles] = useState("");
  const [scoreQuestion, setScoreQuestion] = useState("");
  const [scoreAnswer, setScoreAnswer] = useState("");
  // Badge Type
  const badgeTypeMapping = {
    SILVER_REPUTATION: "SLIVER BADGE REPUTATION",

    SILVER_QUESTION_SCORE: "SLIVER BADGE QUESTION",

    SILVER_ANSWER_SCORE: "SLIVER BADGE ANSWER",

    GOLD_REPUTATION: "GOLD BADGE REPUTATION",

    GOLD_QUESTION_SCORE: "GOLD BADGE QUESTION",

    GOLD_ANSWER_SCORE: "GOLD BADGE ANSWER",

    FIRST_QUESTION_ACCEPTED: "FIRST QUESTION ACCEPTED",

    BRONZE_REPUTATION: "BRONZE BADGE REPUTATION",

    BRONZE_QUESTION_SCORE: "BRONZE BADGE QUESTION",

    BRONZE_ANSWER_SCORE: "BRONZE BADGE ANSWER",

    // Thêm các giá trị khác nếu cần
  };
  const getMaxScoresForBadges = () => {
    return {
      reputationScore: {
        bronze: 100,
        silver: 500,
        gold: 1000,
      },
      questionScore: {
        bronze: 200,
        silver: 500,
        gold: 1000,
      },
      answerScore: {
        bronze: 200,
        silver: 500,
        gold: 1000,
      },
    };
  };
  const maxScores = getMaxScoresForBadges();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the API
        const response = await axiosClient.get(`/users/getOne/${id}`);
        setCurrentProfile(response.data.result);
        setDisplayName(response.data.result.username || "");
        setLocation(response.data.result.location || "");
        setSlogan(response.data.result.slogan || "");
        setAboutMeBody(response.data.result.aboutMe || "");
        setReputation(response.data.result.reputation || "0");
        setBadges(response.data.result.badges || "");
        setRoles(response.data.result.roles || "");
        setScoreQuestion(response.data.result.scoreQuestion || "0");
        setScoreAnswer(response.data.result.scoreAnswer || "0");
        console.log("User data:", response.data.result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchUserData();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [id, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const userId = localStorage.getItem("userId");
  const isCurrentUser = currentProfile && currentProfile.userId === userId;

  const handleBodyChange = (value) => {
    setAboutMeBody(value);
  };

  const handleSave = async () => {
    const updatedProfile = {
      username: displayName, 
      location: location, 
      slogan: slogan, 
      aboutMe: aboutmeBody, 
    };

    console.log("Updating profile with data:", updatedProfile);
    try {
      // Gọi hàm updateUserProfile để lưu thông tin
      const result = await dispatch(
        updateUserProfile(currentProfile.userId, updatedProfile)
      );

      if (result) {
        toast.success("Profile updated successfully!");
        setCurrentProfile({ ...currentProfile, ...updatedProfile });
        setActiveTab("profile");
      } else {
        throw new Error("Failed to get updated user data");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setDisplayName(currentProfile?.username || "");
    setLocation(currentProfile?.location || "");
    setAboutMeBody(currentProfile?.aboutMe || ""); 
    setSlogan(currentProfile?.slogan || "");
    setActiveTab("profile");
  };

  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2">
        <section className="head-userprofile">
          <div style={{ display: "flex" }}>
            <img src={icon} alt="" />
            <div style={{ flexDirection: "column" }}>
              <p className="head-name">{currentProfile?.username}</p>
              <p style={{ opacity: 0.5 }}>
                <FontAwesomeIcon icon={faCake} style={{ marginRight: "5px" }} />
                Member for {moment(currentProfile?.createdAt).fromNow()}
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ marginLeft: "10px", marginRight: "5px" }}
                />
                {currentProfile?.location}
              </p>
            </div>
          </div>
        </section>
        {/* Tab Navigation */}
        <div className="tab-navigation">
          {isCurrentUser && (
            <button
              className={`tab-button ${activeTab === "edit" ? "active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              <FontAwesomeIcon
                icon={faUserPen}
                style={{ marginRight: "5px" }}
              />
              Edit My Profile
            </button>
          )}
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>
        {/* Tab Content */}
        <div className="tab-content">
          {/* Profile của User đang muốn chỉnh sửa */}
          {activeTab === "profile" && (
            <div className="profile-page">
              <div className="results-summary-container">
                <div className="confetti">
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                  <div className="confetti-piece"></div>
                </div>
                <div className="results-summary-container__result">
                  <div className="heading-tertiary">Your Result</div>
                  <div className="result-text-box"></div>
                </div>
                <div className="results-summary-container__options">
                  <div className="heading-secondary heading-secondary--blue">
                    Summary
                  </div>
                  <div className="summary-result-options">
                    <div className="result-option result-option-reaction">
                      <div className="icon-box">
                        <img src={repution} alt="Repution" />
                        <span className="reaction-icon-text">Repution</span>
                      </div>
                      <div className="result-box">
                        <span>
                          {reputation < 100
                            ? `${reputation}/${maxScores.reputationScore.bronze}`
                            : reputation < 500
                            ? `${reputation}/${maxScores.reputationScore.silver}`
                            : reputation < 1000
                            ? `${reputation}/${maxScores.reputationScore.gold}`
                            : `${reputation}`}
                        </span>
                      </div>
                    </div>
                    <div className="result-option result-option-memory">
                      <div className="icon-box">
                        <img src={answer} alt="Answer" />
                        <span className="memory-icon-text">Answer score</span>
                      </div>
                      <div className="result-box">
                        <span>
                          {scoreAnswer < 200
                            ? `${scoreAnswer}/${maxScores.answerScore.bronze}`
                            : scoreAnswer < 500
                            ? `${scoreAnswer}/${maxScores.answerScore.silver}`
                            : scoreAnswer < 1000
                            ? `${scoreAnswer}/${maxScores.answerScore.gold}`
                            : `${scoreAnswer}`}
                        </span>
                      </div>
                    </div>
                    <div className="result-option result-option-verbal">
                      <div className="icon-box">
                        <img src={question} alt="Question" />
                        <span className="verbal-icon-text">
                          Question score{" "}
                        </span>
                      </div>
                      <div className="result-box">
                        <span>
                          {scoreQuestion < 200
                            ? `${scoreQuestion}/${maxScores.questionScore.bronze}`
                            : scoreQuestion < 500
                            ? `${scoreQuestion}/${maxScores.questionScore.silver}`
                            : scoreQuestion < 1000
                            ? `${scoreQuestion}/${maxScores.questionScore.gold}`
                            : `${scoreQuestion}`}
                        </span>
                      </div>
                    </div>
                    <div className="summary__cta"></div>
                  </div>
                </div>
              </div>
              <div className="main-content">
                <div className="section about">
                  <h3>About</h3>
                  {currentProfile ? (
                    isCurrentUser ? (
                      <p>{ReactHtmlParser(currentProfile.aboutMe || "")}</p>
                    ) : currentProfile.aboutMe ? (
                      <p>{ReactHtmlParser(currentProfile.aboutMe)}</p>
                    ) : (
                      <p>No information about the user.</p>
                    )
                  ) : (
                    <p>
                      Your about me section is currently blank. Would you like
                      to add one?{" "}
                      <a href="/" onClick={() => setActiveTab("edit")}>
                        Edit profile
                      </a>
                    </p>
                  )}
                </div>
                <div className="section about">
                  <h3>Slogan</h3>
                  {currentProfile ? (
                    isCurrentUser ? (
                      <p>{ReactHtmlParser(currentProfile.slogan || "")}</p>
                    ) : currentProfile.slogan ? (
                      <p>{ReactHtmlParser(currentProfile.slogan)}</p>
                    ) : (
                      <p>The user haven't slogan yet.</p>
                    )
                  ) : (
                    <p>
                      Your about me section is currently blank. Would you like
                      to add one?{" "}
                      <a href="/" onClick={() => setActiveTab("edit")}>
                        Edit profile
                      </a>
                    </p>
                  )}
                </div>
                <div className="section badge">
                  <h3>Badges</h3>
                  <div className="badge-container">
                    {currentProfile.badges.length > 0 ? (
                      currentProfile.badges.map((badge, index) => {
                        const displayBadgeType =
                          badgeTypeMapping[badge.badgeType] || badge.badgeType; // Sử dụng ánh xạ
                        let badgeImage;
                        switch ((badge.badgeType = displayBadgeType)) {
                          case "GOLD BADGE REPUTATION":
                          case "GOLD BADGE QUESTION":
                          case "GOLD BADGE ANSWER":
                            badgeImage = Gold;
                            break;
                          case "SILVER BADGE REPUTATION":
                          case "SILVER BADGE QUESTION":
                          case "SILVER BADGE ANSWER":
                            badgeImage = Silver;
                            break;
                          case "BRONZE BADGE REPUTATION":
                          case "BRONZE BADGE QUESTION":
                          case "BRONZE BADGE ANSWER":
                            badgeImage = Bronze;
                            break;
                          case "FIRST QUESTION ACCEPTED":
                            return null; // Không hiển thị huy hiệu này
                          default:
                            badgeImage = null; // Không có hình ảnh mặc định
                        }
                        return (
                          <div className="badge-item1" key={index}>
                            <div class="flip-card">
                              <div class="flip-card-inner">
                                <div class="flip-card-front">
                                  <p class="title1">
                                    {badgeImage && (
                                      <img
                                        src={badgeImage}
                                        alt={displayBadgeType}
                                      />
                                    )}
                                  </p>
                                </div>
                                <div class="flip-card-back">
                                  <p class="title">
                                    <div>{badge.description}</div>
                                  </p>
                                  <p>Leave Me</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // Giao diện mặc định nếu không có huy hiệu
                      <div className="no-badges">
                        <div className="default-card">
                          <div className="flip-card">
                            <div className="flip-card-inner">
                              <div className="flip-card-front">
                                <p className="title">Bạn chưa có Huy Hiệu</p>
                              </div>
                              <div className="flip-card-back">
                                <p className="title">
                                  Hãy tham gia hoạt động để nhận huy hiệu!
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {isCurrentUser && activeTab === "edit" && (
            <div className="info-container">
              <div className="edit-profile">
                <h2>Edit your profile</h2>
                <h3>Public information</h3>
                <div className="profile-container">
                  <div className="profile-info">
                    <label>
                      Display name
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </label>
                    <label>
                      Location
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                      />
                    </label>
                    <label>
                      Slogan
                      <input
                        type="text"
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        placeholder="No slogan has been set"
                      />
                    </label>
                    <label>
                      About me
                      <MyEditor
                        value={aboutmeBody}
                        onChange={handleBodyChange}
                        placeholder=""
                      />
                    </label>
                    <div className="button-group">
                      <button className="save-button" onClick={handleSave}>
                        Save
                      </button>
                      <button className="cancel-button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
