package com.blae.service;

import com.blae.dto.AuthResponseDTO;
import com.blae.dto.LoginDTO;
import com.blae.dto.UserProfileDTO;
import com.blae.dto.UserRegistrationDTO;

public interface UserService {

    UserProfileDTO registerCustomer(UserRegistrationDTO registrationDTO);

    UserProfileDTO registerAuthor(UserRegistrationDTO registrationDTO);

    AuthResponseDTO login(LoginDTO loginDTO);

    UserProfileDTO updateUserProfile(Integer id, UserProfileDTO userProfileDTO);

    UserProfileDTO getUserProfileById(Integer id);
}