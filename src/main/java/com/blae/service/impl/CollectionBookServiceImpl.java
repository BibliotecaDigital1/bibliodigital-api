package com.blae.service.impl;

import com.blae.dto.BookDetailsDTO;
import com.blae.mapper.BookMapper;
import com.blae.model.entity.Book;
import com.blae.model.entity.CollectionBook;
import com.blae.repository.BookRepository;
import com.blae.repository.CollectionBookRepository;
import com.blae.repository.CollectionRepository;
import com.blae.service.CollectionBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionBookServiceImpl implements CollectionBookService {

    private final CollectionBookRepository collectionBookRepository;
    private final CollectionRepository collectionRepository;
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    @Override
    @Transactional
    public CollectionBook addBookToCollection(Integer bookId, Integer collectionId) {
        LocalDateTime addedDate = LocalDateTime.now();
        collectionBookRepository.addBookToCollection(bookId, collectionId, addedDate);

        CollectionBook collectionBook = new CollectionBook();
        collectionBook.setBook(bookId);
        collectionBook.setCollection(collectionId);
        collectionBook.setAddedDate(addedDate);

        return collectionBook;
    }

    @Override
    @Transactional
    public void removeBookFromCollection(Integer bookId, Integer collectionId) {
        collectionBookRepository.deleteByBookAndCollection(bookId, collectionId);
    }

    @Override
    public List<BookDetailsDTO> getBooksInCollection(Integer collectionId) {
        List<Integer> bookIds = collectionBookRepository.findBookIdsByCollectionId(collectionId);
        List<Book> books = bookRepository.findAllById(bookIds);
        
        return books.stream()
                .map(bookMapper::toDetailsDTO)
                .toList();
    }
}