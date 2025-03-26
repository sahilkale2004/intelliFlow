import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} IntelliFlow. All rights reserved.</p>
        <p>
          Designed and developed for seamless college event management.
        </p>
        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/contact-us">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;