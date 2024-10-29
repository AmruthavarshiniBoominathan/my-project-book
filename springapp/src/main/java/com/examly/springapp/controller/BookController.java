package com.examly.springapp.controller;

import com.examly.springapp.exception.BookException;
import com.examly.springapp.model.Book;
import com.examly.springapp.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    // Get all books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    // Get book by ID
    @GetMapping("/{bookId}")
    public ResponseEntity<Object> getBookById(@PathVariable int bookId) {
        try {
            Book book = bookService.getBookById(bookId);
            return ResponseEntity.ok(book);
        } catch (BookException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Book not found");
        }
    }

    // Add a new book
    @PostMapping
    public ResponseEntity<Object> addBook(@RequestBody Book book) {
        try {
            Book savedBook = bookService.addBook(book);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
        } catch (BookException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to add book");
        }
    }

    // Update book by ID
    @PutMapping("/{bookId}")
    public ResponseEntity<Object> updateBook(@PathVariable int bookId, @RequestBody Book book) {
        try {
            Book updatedBook = bookService.updateBook(bookId, book);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedBook);
        } catch (BookException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to update book");
        }
    }

    // Delete book by ID
    @DeleteMapping("/{bookId}")
    public ResponseEntity<Object> deleteBook(@PathVariable int bookId) {
        try {
            bookService.deleteBook(bookId);
            return ResponseEntity.ok("Book deleted successfully");
        } catch (BookException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to delete book");
        }
    }
}