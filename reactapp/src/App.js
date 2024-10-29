import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../src/Components/HomePage';
import ErrorPage from '../src/Components/ErrorPage';
import BookForm from './BookRecommenderComponents/BookForm';
import ViewBook from './BookRecommenderComponents/ViewBook';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/error" element={<ErrorPage />} />
        
        {/* All Routes are now accessible without authentication */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/newbook" element={<BookForm />} />
        <Route path="/editbook/:id" element={<BookForm />} />
        <Route path="/viewbook" element={<ViewBook />} />

        {/* Default redirect to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Catch all route for undefined paths */}
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
