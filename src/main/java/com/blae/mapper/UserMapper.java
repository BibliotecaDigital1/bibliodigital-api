package com.blae.mapper;

import com.blae.dto.AuthResponseDTO;
import com.blae.dto.LoginDTO;
import com.blae.dto.UserProfileDTO;
import com.blae.dto.UserRegistrationDTO;
import com.blae.model.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private final ModelMapper modelMapper;

    public UserMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public User toUserEntity(UserRegistrationDTO registrationDTO) {
        return modelMapper.map(registrationDTO, User.class);
    }

    public UserProfileDTO toUserProfileDTO(User user) {
        UserProfileDTO userProfileDTO = modelMapper.map(user, UserProfileDTO.class);

        if (user.getCustomer() != null) {
            userProfileDTO.setFirstName(user.getCustomer().getFirstName());
            userProfileDTO.setLastName(user.getCustomer().getLastName());
            userProfileDTO.setShippingAddress(user.getCustomer().getShippingAddress());
        }

        if (user.getAuthor() != null) {
            userProfileDTO.setFirstName(user.getAuthor().getFirstName());
            userProfileDTO.setLastName(user.getAuthor().getLastName());
            userProfileDTO.setBio(user.getAuthor().getBio());
        }

        return userProfileDTO;
    }

    public User toUserEntity(LoginDTO loginDTO) {
        return modelMapper.map(loginDTO, User.class);
    }

    public AuthResponseDTO toAuthResponseDTO(User user, String token) {
        AuthResponseDTO authResponseDTO = new AuthResponseDTO();
        authResponseDTO.setToken(token);
        authResponseDTO.setId(user.getId());
        authResponseDTO.setEmail(user.getEmail());

        if (user.getCustomer() != null) {
            authResponseDTO.setFirstName(user.getCustomer().getFirstName());
            authResponseDTO.setLastName(user.getCustomer().getLastName());
        }

        else if (user.getAuthor() != null) {
            authResponseDTO.setFirstName(user.getAuthor().getFirstName());
            authResponseDTO.setLastName(user.getAuthor().getLastName());
        }

        else {
            authResponseDTO.setFirstName("Admin");
            authResponseDTO.setLastName("User");
        }

        authResponseDTO.setRole(user.getRole().getName().toString());

        return authResponseDTO;
    }
}