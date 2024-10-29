import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./BookRecommenderNavbar.css";

const BookRecommenderNavbar = () => {

  return (
    <nav className='adminnav'>
      <h1 className="site-title" id="heading">
        <Link to="/home" style={{ color: 'inherit', textDecoration: 'inherit' }}>BookFinder</Link>
      </h1>
      <ul className="nav-links">
       
        <li><Link to="/home">Home</Link></li>
        <li className="dropdown">
          <span className="dropdown-label">Book</span>
          <ul className="dropdown-menu">
            <li><Link to="/newbook">Add Book</Link></li>
            <li><Link to="/viewbook">View Book</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default BookRecommenderNavbar;
