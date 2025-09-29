package com.blae.service;

import com.blae.model.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminBookService {
    List<Book> findAll();
    Page<Book> paginate(Pageable pageable);
    Book create(Book Book);
    Book findById(Integer id);
    Book update(Integer id,Book updateBook);
    void delete(Integer id);
}
