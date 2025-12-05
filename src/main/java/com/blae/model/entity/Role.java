package com.blae.model.entity;

import com.blae.model.enums.ERole;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)  // Esto almacena el nombre del enum como String en la base de datos
    @Column(name = "name", nullable = false, unique = true)
    private ERole name;  // Cambiamos el tipo a RoleEnum
}