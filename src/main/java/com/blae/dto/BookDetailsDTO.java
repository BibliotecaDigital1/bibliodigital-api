package com.blae.dto;

import lombok.Data;

@Data
public class BookDetailsDTO {
    private Integer id;
    private String title;
    private String slug;
    private String description;
    private Float price;
    private String coverPath;
    private String filePath;
    private Integer categoryId;
    private String categoryName;
    private String authorName;
}