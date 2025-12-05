package com.blae.repository;

import com.blae.model.entity.PurchaseItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Integer> {
    boolean existsByBookId(Integer bookId);
}
