import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarLinks } from "../utils/SidebarLinks";
import "../css/Sidebar.css";

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleLinkClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <aside className="sidebar">
      <ul>
        {SidebarLinks.map((sidebarLink) => {
          return (
            <Link
              key={sidebarLink.index}
              to={sidebarLink.link}
              onClick={() => handleLinkClick(sidebarLink.index)}
              className={selectedIndex === sidebarLink.index ? "selected" : ""}
            >
              <p
                className={
                  selectedIndex === sidebarLink.index
                    ? "icons selected"
                    : "icons"
                }
              >
                {sidebarLink.icon}
              </p>
              <p
                className={
                  selectedIndex === sidebarLink.index ? "selected" : ""
                }
              >
                {sidebarLink.title}
              </p>
            </Link>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
