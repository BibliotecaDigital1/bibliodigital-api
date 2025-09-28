package com.blae.api;

import com.blae.model.entity.Author;
import com.blae.service.AdminAuthorService;
import com.blae.service.AdminAuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/authors")
public class AdminAuthorController {
    private final AdminAuthorService adminAuthorService;
    @GetMapping
    public ResponseEntity<List<Author>> listAll(){
        List<Author> autors= adminAuthorService.getAll();
        return new ResponseEntity<>(autors, HttpStatus.OK);
    }
    @GetMapping("/page")
    public ResponseEntity<Page<Author>> paginate(
            @PageableDefault(size = 5, sort= "firtsName") Pageable pageable){
        Page<Author> page= adminAuthorService.paginate(pageable);
        return new ResponseEntity<>(page, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Author> getAuthorById(@PathVariable Integer id){
        Author Author= adminAuthorService.findById(id);
        return new ResponseEntity<>(Author, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Author> create(@RequestBody Author Author){
        Author newAuthor= adminAuthorService.create(Author);
        return new ResponseEntity<Author>(newAuthor, HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Author> update(@PathVariable Integer id, @RequestBody Author author){
        Author updatedAuthor= adminAuthorService.update(id, author);
        return new ResponseEntity<>(updatedAuthor, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        adminAuthorService.delete(id);
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
    }
}
