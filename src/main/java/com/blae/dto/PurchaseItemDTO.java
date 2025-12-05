package com.blae.dto;

import lombok.Data;

@Data
public class PurchaseItemDTO {
    private Integer id;
    private Integer bookId;
    private Float price;
    private Integer quantity;
    private String bookTitle;
}