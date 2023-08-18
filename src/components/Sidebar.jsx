import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import { SidebarLinks } from './SidebarLinks'
import "./css/Sidebar.css"

const Sidebar = () => {
  const [selected, setSelected] = useState(false);

  const handleLinkClick = (event, key) => {
      console.log(event.target);
      console.log("key: " + key);
  }

  return (
    <aside className="sidebar">
      <ul>
        {
            SidebarLinks.map((sidebarLink) => {
                return (
                    <li 
                      key={sidebarLink.index} 
                      onClick={handleLinkClick}
                      className= {(sidebarLink.selected) && 'selected'}
                    >

                        <p className='icons'>{sidebarLink.icon}</p>
                        <Link 
                            to={sidebarLink.link}
                            className= {(sidebarLink.selected) && 'selected-text'}
                            >
                          {sidebarLink.title}
                        </Link>
                    </li>
                )
            })
        }
      </ul>
    </aside>
  )
}

export default Sidebar