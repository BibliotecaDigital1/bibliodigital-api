package com.blae.mapper;
import com.blae.dto.CategoryDTO;
import com.blae.model.entity.Category;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    private final ModelMapper modelMapper;

    public CategoryMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public CategoryDTO toDto(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }

    public Category toEntity(CategoryDTO categoryDTO) {
        return modelMapper.map(categoryDTO, Category.class);
    }
}