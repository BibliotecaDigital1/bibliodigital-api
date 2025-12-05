package com.blae.dto;

import com.blae.model.enums.ERole;
import lombok.Data;

@Data
public class UserProfileDTO {

    private Integer id;
    private String email;
    private ERole role;

    private String firstName;
    private String lastName;
    private String shippingAddress;

    private String bio;

    private String currentPassword;
    private String newPassword;
}