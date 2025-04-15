import React, { useState, useEffect } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../actions/currentUser";
import logo from "../../components/assets/logo2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "antd";
import searchIcon from "../../components/assets/search.svg";
import { toast } from "react-toastify";
import login from "../../components/assets/login.svg";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  // Lấy token từ localStorage
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      dispatch(setCurrentUser({ token }));
    } else {
      dispatch(setCurrentUser(null));
    }
  }, [dispatch, token]);
  //cho thêm username vào user

  const handleLogOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("viewedQuestions");
    dispatch({ type: "LOGOUT" });
    navigate("/Auth");
    dispatch(setCurrentUser(null));
    toast.success("Logged out successfully!");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      navigate(`/Search?query=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Error searching questions:", error);
    }
  };

  const menuItems = [
    {
      key: "userProfile",
      label: (
        <Link to={`/UserProfile/${localStorage.getItem("userId")}`}>
          User Profile
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <button
          onClick={handleLogOut}
          style={{
            border: "none",
            background: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          Log Out
        </button>
      ),
    },
  ];

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <nav className="main-nav">
      <div className="navbar">
        <Link to="/" className="nav-item nav-logo">
          <img src={logo} alt="logo" />
        </Link>
        <Link to="/" className="nav-item nav-btn">
          About
        </Link>
        <Link to="/" className="nav-item nav-btn">
          Products
        </Link>
        <Link to="/" className="nav-item nav-btn">
          For Teams
        </Link>
        <div className="search">
          <input
            type="text"
            className="search__input"
            placeholder="Type your text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            required
          />
          <button className="search__button" onClick={handleSearch}>
            <img src={searchIcon} alt="Search Icon" className="search__icon" />
          </button>
        </div>

        {/* Kiểm tra dựa trên token */}
        {location.pathname !== "/Auth" && !token ? (
          <Link to="/Auth" className="nav-item nav-links">
            <img src={login} alt="login" />
          </Link>
        ) : (
          token && (
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <button className="faq-button">
                <FontAwesomeIcon icon={faUser} className="faq-icon" />
              </button>
            </Dropdown>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
