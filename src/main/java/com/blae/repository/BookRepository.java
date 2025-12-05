package com.blae.repository;

import com.blae.model.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Integer> {
    Optional<Book> findByTitleOrSlug(String title, String slug);

    List<Book> findTop6ByOrderByCreatedAtDesc();

    boolean existsByAuthorId(Integer authorId);

    boolean existsByCategoryId(Integer categoryId);
}
