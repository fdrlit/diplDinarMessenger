import React, { useState } from 'react'
import * as BsIcons from "react-icons/bs";
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './Sidebar.scss'

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? <AiIcons.AiOutlineClose /> : <BsIcons.BsList />}
        </div>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className={`sidebar-links${sidebarOpen ? ' active' : ''}`}>
          <a href="#">Домашняя</a>
          <a href="#">Example2</a>
          <a href="#">Example 3</a>
          <a href="#">Example 4</a>
          <a href="#">Example 5</a>
        </div>
      </div>
      <div className={`${sidebarOpen ? 'sidebar-overlay' : ''}`} onClick={toggleSidebar}>asd</div>
    </div>
  );
};
export default Sidebar;