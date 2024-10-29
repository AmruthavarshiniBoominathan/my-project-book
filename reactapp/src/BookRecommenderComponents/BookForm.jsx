import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import BookRecommenderNavbar from './BookRecommenderNavbar';
import './BookForm.css'; // Import the CSS file for styling

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [filePreview, setFilePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedDate: '',
    genre: '',
    coverImage: null,
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id]);

  useEffect(() => {
    // Clean up file URL on component unmount
    return () => {
      if (filePreview && typeof filePreview === 'string') {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const fetchBook = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        const book = response.data;
        if (book.coverImage) {
          setFilePreview(book.coverImage); // Assuming this is a Base64 or valid image URL
        }
        setFormData({
          title: book.title,
          author: book.author,
          publishedDate: book.publishedDate.split('T')[0], // Ensure date format is correct
          genre: book.genre,
          coverImage: null,
        });
      }
    } catch (error) {
      console.log("Error fetching book:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.publishedDate) newErrors.publishedDate = 'Published Date is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!id && !formData.coverImage) newErrors.coverImage = 'Cover image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      let base64CoverImage = null;
      if (formData.coverImage) {
        base64CoverImage = await convertFileToBase64(formData.coverImage);
      }

      const payload = {
        title: formData.title,
        author: formData.author,
        publishedDate: formData.publishedDate,
        genre: formData.genre,
        coverImage: id ? filePreview : base64CoverImage, // Use the existing image if editing
      };

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      console.log(localStorage.getItem('token'));


      const response = id
        ? await axios.put(`${API_BASE_URL}/api/books/${id}`, payload, config)
        : await axios.post(`${API_BASE_URL}/api/books`, payload, config);

      if (response.status === 200 || response.status === 201) {
        setShowModal(true);
      }
    } catch (error) {
      console.log("Error adding or updating book:", error);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await convertFileToBase64(file);
      setFilePreview(base64String);
      setFormData({
        ...formData,
        coverImage: file, // Use lowercase key for consistency
      });
      setErrors(prevErrors => ({ ...prevErrors, coverImage: undefined })); // Clear any existing errors
    } else {
      setFilePreview(null); // Reset preview if no file is selected
      setFormData({
        ...formData,
        coverImage: null,
      });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div>
      <BookRecommenderNavbar />
      <div className="book-form-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <h2>{id ? 'Edit Book' : 'Create New Book'}</h2>
        <form onSubmit={onSubmit}>
        <label htmlFor="title">Title<span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="title" // Ensure this matches the state key
            placeholder="Title"
            value={formData.title} // Ensure this matches the state key
            onChange={handleInputChange}
          />
          {errors.title && <span className="error">{errors.title}</span>}

          <label htmlFor="author">Author<span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="author" // Ensure this matches the state key
            placeholder="Author"
            value={formData.author} // Ensure this matches the state key
            onChange={handleInputChange}
          />
          {errors.author && <span className="error">{errors.author}</span>}

          <label htmlFor="publishedDate">Published Date<span className="required-asterisk">*</span></label>
          <input
            type="date"
            id="publishedDate" // Ensure this matches the state key
            value={formData.publishedDate} // Ensure this matches the state key
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]} // Ensure max date is today
          />
          {errors.publishedDate && <span className="error">{errors.publishedDate}</span>}

          <label htmlFor="genre">Genre<span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="genre" // Ensure this matches the state key
            placeholder="Genre"
            value={formData.genre} // Ensure this matches the state key
            onChange={handleInputChange}
          />
          {errors.genre && <span className="error">{errors.genre}</span>}

          <label htmlFor="coverImage">Cover Image<span className="required-asterisk">*</span>
          </label>
          <input
            type="file"
            id="coverImage" // Changed to lowercase
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
          />
          {errors.coverImage && <span className="error">{errors.coverImage}</span>}

          {filePreview && <img src={filePreview} alt="Cover Preview" className="cover-preview" />}

          <button type="submit" className="submit-button">{id ? 'Update Book' : 'Add Book'}</button>
        </form>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-popup">
              <p>{id ? 'Book updated successfully!' : 'Book added successfully!'}</p>
              <button onClick={() => navigate('/viewbook')}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookForm;
