package com.examly.springapp.service;

import com.examly.springapp.exception.BookException;
import com.examly.springapp.model.Book;
import com.examly.springapp.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // Get all books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Get a book by its ID
    public Book getBookById(int bookId) throws BookException {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException("Book not found with ID: " + bookId));
    }

    // Add a new book
    public Book addBook(Book book) throws BookException {
        // Check if a book with the same title exists
        if (bookRepository.existsByTitle(book.getTitle())) {
            throw new BookException("Book with title '" + book.getTitle() + "' already exists");
        }
        return bookRepository.save(book);
    }

    // Update an existing book
    public Book updateBook(int bookId, Book updatedBook) throws BookException {
        Optional<Book> existingBook = bookRepository.findById(bookId);
        if (existingBook.isPresent()) {
            Book book = existingBook.get();
            
            // Update all fields
            book.setTitle(updatedBook.getTitle());
            book.setAuthor(updatedBook.getAuthor());
            book.setGenre(updatedBook.getGenre());
            book.setPublishedDate(updatedBook.getPublishedDate());
            book.setCoverImage(updatedBook.getCoverImage());
            
            return bookRepository.save(book);
        } else {
            throw new BookException("Cannot update. Book not found with ID: " + bookId);
        }
    }

    // Delete a book by its ID
    public void deleteBook(int bookId) throws BookException {
        if (bookRepository.existsById(bookId)) {
            bookRepository.deleteById(bookId);
        } else {
            throw new BookException("Cannot delete. Book not found with ID: " + bookId);
        }
    }
}