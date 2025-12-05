package com.blae.repository;

import com.blae.model.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

    List<Purchase> findByUserId(Integer userId);

    boolean existsByUserId(Integer userId);


    @Query(value = "SELECT * FROM fn_list_purchase_report() ", nativeQuery = true)
    List<Object[]> getPurchaseReportByDate();
}