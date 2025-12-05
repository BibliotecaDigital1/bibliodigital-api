package com.blae.api;

import com.blae.dto.BookCreateUpdateDTO;
import com.blae.dto.BookDetailsDTO;
import com.blae.service.AdminBookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/books")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookController {

    private final AdminBookService adminBookService;

    @GetMapping
    public ResponseEntity<List<BookDetailsDTO>> getAllBooks() {
        List<BookDetailsDTO> books = adminBookService.findAll();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<BookDetailsDTO>> paginateBooks(
            @PageableDefault(size = 10, sort = "title") Pageable pageable) {
        Page<BookDetailsDTO> books = adminBookService.paginate(pageable);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDetailsDTO> getBookById(@PathVariable Integer id) {
        BookDetailsDTO book = adminBookService.findById(id);
        return new ResponseEntity<>(book, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BookDetailsDTO> createBook(@Valid @RequestBody BookCreateUpdateDTO bookDTO) {
        BookDetailsDTO newBook = adminBookService.create(bookDTO);
        return new ResponseEntity<>(newBook, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDetailsDTO> updateBook(@PathVariable Integer id,
                                                      @Valid @RequestBody BookCreateUpdateDTO bookDTO) {
        BookDetailsDTO updatedBook = adminBookService.update(id, bookDTO);
        return new ResponseEntity<>(updatedBook, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        adminBookService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
