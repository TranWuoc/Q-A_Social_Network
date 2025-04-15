import React from "react";
import "./LeftSidebar.css";
import { NavLink } from "react-router-dom";
import { FaHome, FaQuestionCircle, FaUserAlt, FaTag } from "react-icons/fa";
import globe from "../../components/assets/globe-solid.svg";

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      <nav className="side-nav">
        <NavLink
          to="/"
          className={(navData) => (navData.isActive ? "side-nav-links active" : "side-nav-links")}
        >
          <FaHome style={{ marginRight: "10px", fontSize: "18px" }} />
          <p>Home</p>
        </NavLink>
        <div className="side-nav-div">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "10px",
              borderRadius: "0px ",
              borderLeft: "10px solid Orange",
            }}
          >
            <img src={globe} style={{ width: "17px" }} alt="Globe" />
            Public
          </div>
          <NavLink
            to="/Questions"
            className={(navData) => (navData.isActive ? "side-nav-links active" : "side-nav-links")}
          >
            <FaQuestionCircle style={{ marginRight: "10px", fontSize: "18px" }} />
            <p>Questions</p>
          </NavLink>
          <NavLink
            to="/Tags"
            className={(navData) => (navData.isActive ? "side-nav-links active" : "side-nav-links")}
            style={{ paddingLeft: "10px" }}
          >
            <FaTag style={{ marginRight: "10px", fontSize: "18px" }} />
            <p>Tags</p>
          </NavLink>
          <NavLink
            to="/Users"
            className={(navData) => (navData.isActive ? "side-nav-links active" : "side-nav-links")}
            style={{ paddingLeft: "10px" }}
          >
            <FaUserAlt style={{ marginRight: "10px", fontSize: "18px" }} />
            <p>Users</p>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default LeftSidebar;
