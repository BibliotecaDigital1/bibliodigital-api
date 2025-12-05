package com.blae.api;

import com.blae.dto.BookDetailsDTO;
import com.blae.model.entity.CollectionBook;
import com.blae.service.CollectionBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collections-books")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class CollectionBookController {

    private final CollectionBookService collectionBookService;

    @PostMapping("/{collectionId}/add-book")
    public ResponseEntity<CollectionBook> addBookToCollection(@PathVariable Integer collectionId, @RequestParam Integer bookId) {
        CollectionBook collectionBook = collectionBookService.addBookToCollection(bookId, collectionId);
        return new ResponseEntity<>(collectionBook, HttpStatus.CREATED);
    }

    @DeleteMapping("/{collectionId}/remove-book/{bookId}")
    public ResponseEntity<Void> removeBookFromCollection(@PathVariable Integer collectionId, @PathVariable Integer bookId) {
        collectionBookService.removeBookFromCollection(bookId, collectionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{collectionId}/books")
    public ResponseEntity<List<BookDetailsDTO>> getBooksInCollection(@PathVariable Integer collectionId) {
        List<BookDetailsDTO> books = collectionBookService.getBooksInCollection(collectionId);
        return ResponseEntity.ok(books);
    }
}