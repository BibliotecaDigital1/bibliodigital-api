package com.blae.repository;

import com.blae.model.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    boolean existsByFirstNameAndLastName(String firstName, String lastName);

    boolean existsByFirstNameAndLastNameAndUserIdNot(String firstName, String lastName, Integer userId);
}