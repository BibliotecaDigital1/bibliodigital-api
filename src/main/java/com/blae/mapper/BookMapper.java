package com.blae.mapper;

import com.blae.dto.BookCreateUpdateDTO;
import com.blae.dto.BookDetailsDTO;
import com.blae.model.entity.Book;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {
    private final ModelMapper modelMapper;

    public BookMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
    }

    public BookDetailsDTO toDetailsDTO(Book book) {
        BookDetailsDTO bookDetailsDTO = modelMapper.map(book, BookDetailsDTO.class);
        if (book.getAuthor() != null) {
            bookDetailsDTO.setAuthorName(book.getAuthor().getFirstName() + " " + book.getAuthor().getLastName());
        }
        if (book.getCategory() != null) {
            bookDetailsDTO.setCategoryId(book.getCategory().getId());
            bookDetailsDTO.setCategoryName(book.getCategory().getName());
        }
        return bookDetailsDTO;
    }

    public Book toEntity(BookCreateUpdateDTO bookCreateUpdateDTO) {
        return modelMapper.map(bookCreateUpdateDTO, Book.class);
    }

    public BookCreateUpdateDTO toCreateUpdateDTO(Book book) {
        return modelMapper.map(book, BookCreateUpdateDTO.class);
    }
}