import React from "react";
import logo from "../images/ACN_BIG.svg";

const Navbar = () => {
  return (
    <nav>
      <div className="nav--wrapper">
        <img src={logo} alt="Accenture Logo" className="accenture--logo" />
        <h1>TRIAGE SYSTEM</h1>
      </div>
    </nav>
  );
};

export default Navbar;
