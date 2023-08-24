import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarLinks } from "../utils/SidebarLinks";
import "./css/Sidebar.css";

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(false);

  const handleLinkClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <aside className="sidebar">
      <ul>
        {SidebarLinks.map((sidebarLink) => {
          return (
            <li
              key={sidebarLink.index}
              onClick={() => handleLinkClick(sidebarLink.index)}
              className={selectedIndex === sidebarLink.index ? "selected" : ""}
            >
              <p className="icons">{sidebarLink.icon}</p>
              <Link
                to={sidebarLink.link}
                className={
                  selectedIndex === sidebarLink.index ? "selected-text" : ""
                }
              >
                {sidebarLink.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
