import React from "react";
import { Link } from "react-router-dom"; // Import Link or NavLink from react-router-dom
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="logo-container">
        <img
          src="https://media.licdn.com/dms/image/D4E0BAQFM40fm__dHoA/company-logo_100_100/0/1704498665301/trace_ai_co_logo?e=1713398400&v=beta&t=OqXbKU-Y3Nvb3uX_tRFGSfwu44kcohctNgMGxGx0JPY"
          alt="logo"
          className="logo"
        />
        <span className="logo-text">Trace AI</span>
        <Link to="/upload-insurance-documents" className="tab">
          Upload Insurance Documents
        </Link>
        <Link to="/guideline-discovery" className="tab">
          Guideline Discovery
        </Link>
        <Link to="/requirement-analysis" className="tab">
          Requirement Analysis
        </Link>
        <Link to="/phone-call-automation" className="tab">
          Phone Call Automation
        </Link>
      </div>
      <div className="tabs-container"></div>
      <div className="navbar-line"></div>
    </div>
  );
};

export default NavBar;
