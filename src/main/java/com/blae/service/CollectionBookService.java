package com.blae.service;

import com.blae.dto.BookDetailsDTO;
import com.blae.model.entity.CollectionBook;

import java.util.List;

public interface CollectionBookService {

    CollectionBook addBookToCollection(Integer bookId, Integer collectionId);
    void removeBookFromCollection(Integer bookId, Integer collectionId);
    List<BookDetailsDTO> getBooksInCollection(Integer collectionId);
}