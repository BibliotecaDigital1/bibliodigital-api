package com.blae.service;

import com.blae.model.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface AdminCategoryService {
    List<Category> getAllCategories();
    Page<Category> paginate(Pageable pageable);
    Category findById(Integer id);
    Category create(Category entity);
    Category update(Integer id,Category entity);
    void delete(Integer id);

}
