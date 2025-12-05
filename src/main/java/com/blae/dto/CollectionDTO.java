package com.blae.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CollectionDTO {
    private Integer id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer bookCount;
}
