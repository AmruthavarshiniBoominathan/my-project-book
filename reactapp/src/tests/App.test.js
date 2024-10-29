import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import axios from "axios";
import BookForm from "../BookRecommenderComponents/BookForm";
import ViewBook from "../BookRecommenderComponents/ViewBook";
import BookRecommenderNavbar from "../BookRecommenderComponents/BookRecommenderNavbar";
import HomePage from "../Components/HomePage";

// Mock axios and react-router-dom
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: undefined }),
}));

describe('BookForm Component', () => {
  const renderBookForm = () => {
    render(
      <Router>
        <BookForm />
      </Router>
    );
  };

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    global.URL.revokeObjectURL = jest.fn();
  });
  
  afterAll(() => {
    global.URL.createObjectURL.mockRestore();
    global.URL.revokeObjectURL.mockRestore();
  });

  test('frontend_bookform_rendersCreateTitle', () => {
    renderBookForm();
    expect(screen.getByText('Create New Book')).toBeInTheDocument();
  });

test('frontend_bookform_displaysRequiredFields', () => {
  renderBookForm();
  
  expect(screen.getByLabelText(/title/i)).toBeInTheDocument(); // Use regex for case insensitivity
  expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/genre/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/cover image/i)).toBeInTheDocument(); // Lowercase for consistency
  expect(screen.getByLabelText(/published date/i)).toBeInTheDocument();
});


  test('frontend_bookform_showsValidationErrors', async () => {
    renderBookForm();
    const submitButton = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Author is required')).toBeInTheDocument();
      expect(screen.getByText('Published Date is required')).toBeInTheDocument();
      expect(screen.getByText('Genre is required')).toBeInTheDocument();
      expect(screen.getByText('Cover image is required')).toBeInTheDocument();
    });
  });

  test('frontend_bookform_handlesNewBookSubmission_navigatesToBookList', async () => {
    // Mock the API call to resolve after a short delay
    axios.post.mockResolvedValue({ status: 201 });
  
    renderBookForm();
  
    // Fill in form data
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Book' } });
    fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'Test Author' } });
    fireEvent.change(screen.getByLabelText(/Published Date/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/Genre/i), { target: { value: 'Fiction' } });
  
    // Mock the cover image file input
    const file = new File(['dummy content'], 'cover.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText(/Cover Image/i), { target: { files: [file] } });
  
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Add Book/i }));
  
  });
  
});

// Test Cases for ViewBook Component
describe('ViewBook Component', () => {
  const mockBooks = [
    {
      bookId: 1,
      title: 'Test Book',
      author: 'Test Author',
      publishedDate: '2024-10-25',
      genre: 'Test Genre',
      coverImage: 'test-image-url'
    }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ status: 200, data: mockBooks });
  });

  const renderViewBook = () => {
    render(
      <Router>
        <ViewBook />
      </Router>
    );
  };

  test('frontend_viewbook_rendersTableCorrectly', async () => {
    renderViewBook();
    await waitFor(() => {
      expect(screen.getByText('Books')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Author')).toBeInTheDocument();
    });
  });

  test('frontend_viewbook_displaysApiData', async () => {
    renderViewBook();
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Test Genre')).toBeInTheDocument();
    });
  });

  test('frontend_viewbook_handlesDeleteConfirmation', async () => {
    renderViewBook();
    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
      expect(screen.getByText('Are you sure you want to delete this book?')).toBeInTheDocument();
    });
  });

  test('frontend_viewbook_handlesEmptyState', async () => {
    axios.get.mockResolvedValue({ status: 200, data: [] });
    renderViewBook();
    await waitFor(() => {
      expect(screen.getByText('Oops! No records found')).toBeInTheDocument();
    });
  });
});

// Test Cases for BookRecommenderNavbar Component
describe('BookRecommenderNavbar Component', () => {
  
  const renderNavbar = () => {
    render(
      <Router>
        <BookRecommenderNavbar />
      </Router>
    );
  };



  test('frontend_navbar_containsNavigationLinks', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Book')).toBeInTheDocument();
  });
});

// Test Cases for HomePage Component
describe('HomePage Component', () => {
  const renderHomePage = () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );
  };

  test('frontend_homepage_rendersMainContent', () => {
    renderHomePage();
    expect(screen.getByRole('link', { name: /BookFinder/i })).toBeInTheDocument();
    expect(screen.getByText('BookFinder', { selector: 'div.title' })).toBeInTheDocument();
    expect(screen.getByText(/An app to discover, explore, and recommend books tailored to your reading preferences./)).toBeInTheDocument();
  });

  test('frontend_homepage_displaysContactInfo', () => {
    renderHomePage();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Email: example@example.com')).toBeInTheDocument();
    expect(screen.getByText('Phone: 123-456-7890')).toBeInTheDocument();
  });

  test('frontend_homepage_includesNavigation', () => {
    renderHomePage();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});