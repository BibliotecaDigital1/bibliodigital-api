package com.blae.repository;

import com.blae.model.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionRepository extends JpaRepository<Collection, Integer> {

    List<Collection> findByCustomer_Id(Integer customerId);

    boolean existsByCustomerId(Integer customerId);
}
