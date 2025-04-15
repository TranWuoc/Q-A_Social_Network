import React from 'react';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Phần hiển thị logo */}
        <div className="footer-logo">
          <img src="/Stack_Overflow_icon.png" alt="Stack Overflow Icon" />
        </div>

        {/* Phần Stack Overflow */}
        <div className="footer-section">
          <h4>STACK OVERFLOW</h4>
          <ul>
            <li><a href="/">Questions</a></li>
            <li><a href="/">Help</a></li>
            <li><a href="/">Chat</a></li>
          </ul>
        </div>

        {/* Phần Products */}
        <div className="footer-section">
          <h4>PRODUCTS</h4>
          <ul>
            <li><a href="/">Teams</a></li>
            <li><a href="/">Advertising</a></li>
            <li><a href="/">Talent</a></li>
          </ul>
        </div>

        {/* Phần Company */}
        <div className="footer-section">
          <h4>COMPANY</h4>
          <ul>
            <li><a href="/">About</a></li>
            <li><a href="/">Press</a></li>
            <li><a href="/">Work Here</a></li>
            <li><a href="/">Legal</a></li>
            <li><a href="/">Privacy Policy</a></li>
            <li><a href="/">Terms of Service</a></li>
            <li><a href="/">Contact Us</a></li>
            <li><a href="/">Cookie Settings</a></li>
            <li><a href="/">Cookie Policy</a></li>
          </ul>
        </div>

        {/* Phần Stack Exchange Network */}
        <div className="footer-section">
          <h4>STACK EXCHANGE NETWORK</h4>
          <ul>
            <li><a href="/">Technology</a></li>
            <li><a href="/">Culture & recreation</a></li>
            <li><a href="/">Life & arts</a></li>
            <li><a href="/">Science</a></li>
            <li><a href="/">Professional</a></li>
            <li><a href="/">Business</a></li>
          </ul>
        </div>
         {/* Phần Blog và Social Media */}
         <div className="footer-section footer-social-container">
          <ul className="footer-social">
            <li><a href="/"><i className="fab fa-blogger-b"></i> </a></li>
            <li><a href="/"><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="/"><i className="fab fa-twitter"></i></a></li>
            <li><a href="/"><i className="fab fa-linkedin-in"></i></a></li>
            <li><a href="/"><i className="fab fa-instagram"></i></a></li>
          </ul>
        </div>
      </div>

      {/* Phần cuối cùng */}
      <div className="footer-bottom">
        <p>Site design / logo © 2024 Stack Exchange Inc; user contributions licensed under <a href="/">CC BY-SA</a>.</p>
      </div>
    </footer>
  );
};

export default Footer;
