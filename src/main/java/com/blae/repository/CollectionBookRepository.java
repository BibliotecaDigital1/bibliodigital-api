package com.blae.repository;

import com.blae.model.entity.Book;
import com.blae.model.entity.CollectionBook;
import com.blae.model.entity.CollectionBookPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface CollectionBookRepository extends JpaRepository<CollectionBook, CollectionBookPK> {

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO collection_books (book_id, collection_id, added_date) VALUES (:bookId, :collectionId, :addedDate)", nativeQuery = true)
    void addBookToCollection(@Param("bookId") Integer bookId, @Param("collectionId") Integer collectionId, @Param("addedDate") LocalDateTime addedDate);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM collection_books WHERE book_id = :bookId AND collection_id = :collectionId", nativeQuery = true)
    void deleteByBookAndCollection(@Param("bookId") Integer bookId, @Param("collectionId") Integer collectionId);

    @Query("SELECT cb.book FROM CollectionBook cb WHERE cb.collection = :collectionId")
    List<Integer> findBookIdsByCollectionId(@Param("collectionId") Integer collectionId);

    boolean existsByBook(Integer bookId);
}