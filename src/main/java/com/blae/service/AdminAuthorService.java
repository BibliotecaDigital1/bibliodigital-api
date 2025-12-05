package com.blae.service;

import com.blae.dto.AuthorDTO;
import com.blae.model.entity.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
public interface AdminAuthorService {
    List<AuthorDTO> getAll();
    Page<AuthorDTO> paginate(Pageable pageable);
    AuthorDTO findById(Integer id);
    AuthorDTO create(AuthorDTO AuthorDTO);
    AuthorDTO update(Integer id, AuthorDTO updateAuthorDTO);
    void delete(Integer id);
}
