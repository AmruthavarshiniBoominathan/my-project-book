package com.examly.springapp.repository;

import com.examly.springapp.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    // Method to check if a book with the same title already exists
    boolean existsByTitle(String title);
}
