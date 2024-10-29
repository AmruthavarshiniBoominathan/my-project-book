import React from 'react';
import './HomePage.css'; // Import your custom styles
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import BookRecommenderNavbar from '../BookRecommenderComponents/BookRecommenderNavbar';

const HomePage = () => {
    
  return (
    <div className="wrapper">
      {/* Always show the BookRecommenderNavbar */}
      <BookRecommenderNavbar />
      <div className="coverimage">
        <LazyLoadImage
          effect="blur"
          src={process.env.PUBLIC_URL + '/bookfindercoverimage.jpeg'} 
          alt="Cover" 
        />
        <div className="title">BookFinder</div>
      </div>

      <div className="content">
        <p>An app to discover, explore, and recommend books tailored to your reading preferences.</p>
      </div>

      <div className="contact">
        <h2>Contact Us</h2>
        <p>Email: example@example.com</p>
        <p>Phone: 123-456-7890</p>
      </div>
    </div>
  );
};

export default HomePage;
