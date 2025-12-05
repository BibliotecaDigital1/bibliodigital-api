package com.blae.api;

import com.blae.dto.BookDetailsDTO;
import com.blae.service.AdminBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class HomeBookController {

    private final AdminBookService adminBookService;

    @GetMapping("/recent")
    public ResponseEntity<List<BookDetailsDTO>> getRecentBooks() {
        List<BookDetailsDTO> recentBooks = adminBookService.findTop6BooksByCreatedAt();
        return new ResponseEntity<>(recentBooks, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<BookDetailsDTO>> getAllBooks() {
        List<BookDetailsDTO> books = adminBookService.findAll();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDetailsDTO> getBookById(@PathVariable Integer id) {
        BookDetailsDTO book = adminBookService.findById(id);
        return new ResponseEntity<>(book, HttpStatus.OK);
    }
}