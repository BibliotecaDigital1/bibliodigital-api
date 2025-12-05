package com.blae.api;

import com.blae.dto.CategoryDTO;
import com.blae.service.AdminCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class HomeCategoryController {

    private final AdminCategoryService adminCategoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = adminCategoryService.getAll();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
}
