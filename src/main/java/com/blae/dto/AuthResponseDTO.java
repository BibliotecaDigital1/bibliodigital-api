package com.blae.dto;
import lombok.Data;
@Data
public class AuthResponseDTO {
    private String token;

    private Integer id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
