package com.blae.service;

import com.blae.model.entity.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
public interface AdminAuthorService {
    List<Author> getAll();
    Page<Author> paginate(Pageable pageable);
    Author findById(Integer id);
    Author create(Author author);
    Author update(Integer id,Author updateAuthor);
    void delete(Integer id);
}
