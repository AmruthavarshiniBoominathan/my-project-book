import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./BookRecommenderNavbar"; // Adjust the import based on your actual Navbar component
import API_BASE_URL from "../apiConfig";
import "./ViewBook.css"; // Adjust the import based on your actual CSS file

const ViewBook = () => {
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);

  // Function to handle delete button click
  const handleDeleteClick = (bookId) => {
    setBookToDelete(bookId);
    setShowDeletePopup(true);
  };

  // Function to confirm deletion
  const handleConfirmDelete = async () => {
    try {
      if (bookToDelete) {
        const response = await axios.delete(
          `${API_BASE_URL}/api/books/${bookToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          fetchAvailableBooks(); // Refresh book list after deletion
        } else {
          console.error("Error deleting book:", response.statusText);
        }
        closeDeletePopup();
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  // Function to close the delete confirmation popup
  const closeDeletePopup = () => {
    setBookToDelete(null);
    setShowDeletePopup(false);
  };

  // Function to fetch all available books from the API
  const fetchAvailableBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/books`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        setAvailableBooks(res.data);
      } else {
        console.error("Error fetching books:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // useEffect hook to fetch books when component loads
  useEffect(() => {
    fetchAvailableBooks();
  }, []);

  // Function to handle edit button click
  const handleEditClick = (bookId) => {
    navigate(`/editbook/${bookId}`);
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  };

  return (
    <div id="parent">
      <Navbar />
      <div id="bookHomeBody" className={showDeletePopup ? "blur" : ""}>
        <h1>Books</h1>

        <table className="book-table">
          <thead>
            <tr>
              <th>Cover Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publication Date</th>
              <th>Genre</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {availableBooks.length > 0 ? (
              availableBooks.map((book) => (
                <tr key={book.bookId}>
                  <td>
                    <img
                      src={book.coverImage} 
                      alt="Cover"
                      className="cover-image"
                    />
                  </td>
                  <td>{book.title}</td> 
                  <td>{book.author}</td> 
                  <td>{formatDate(book.publishedDate)}</td>
                  <td>{book.genre}</td> 
                  <td>
                    <button
                      id="greenButton"
                      className="viewbookbutton"
                      onClick={() => handleEditClick(book.bookId)} 
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(book.bookId)} 
                      id="deleteButton"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="no-records-cell">
                  Oops! No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showDeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete this book?</p>
          <button onClick={handleConfirmDelete}>Yes, Delete</button>
          <button onClick={closeDeletePopup}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ViewBook;
