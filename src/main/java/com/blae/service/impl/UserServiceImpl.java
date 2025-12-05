package com.blae.service.impl;

import com.blae.dto.AuthResponseDTO;
import com.blae.dto.LoginDTO;
import com.blae.dto.UserProfileDTO;
import com.blae.dto.UserRegistrationDTO;
import com.blae.exception.BadRequestException;
import com.blae.exception.InvalidCredentialsException;
import com.blae.exception.ResourceNotFoundException;
import com.blae.exception.RoleNotFoundException;
import com.blae.mapper.UserMapper;
import com.blae.model.entity.Author;
import com.blae.model.entity.Customer;
import com.blae.model.entity.Role;
import com.blae.model.entity.User;
import com.blae.model.enums.ERole;
import com.blae.repository.AuthorRepository;
import com.blae.repository.CustomerRepository;
import com.blae.repository.RoleRepository;
import com.blae.repository.UserRepository;
import com.blae.security.TokenProvider;
import com.blae.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AuthorRepository authorRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    @Transactional
    @Override
    public UserProfileDTO registerCustomer(UserRegistrationDTO registrationDTO) {
        return registerUserWithRole(registrationDTO, ERole.CUSTOMER);
    }

    @Transactional
    @Override
    public UserProfileDTO registerAuthor(UserRegistrationDTO registrationDTO) {
        return registerUserWithRole(registrationDTO, ERole.AUTHOR);
    }

    @Transactional
    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {

        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el email: " + loginDTO.getEmail()));

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Credenciales incorrectas");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        String token = tokenProvider.createAccessToken(authentication);

        AuthResponseDTO response = userMapper.toAuthResponseDTO(user, token);

        return response;
    }

    private UserProfileDTO registerUserWithRole(UserRegistrationDTO registrationDTO, ERole roleEnum) {

        boolean emailExists = userRepository.existsByEmail(registrationDTO.getEmail());
        boolean existsAsCustomer = customerRepository.existsByFirstNameAndLastName(registrationDTO.getFirstName(), registrationDTO.getLastName());
        boolean existsAsAuthor = authorRepository.existsByFirstNameAndLastName(registrationDTO.getFirstName(), registrationDTO.getLastName());

        if (emailExists) {
            throw new UsernameNotFoundException("El email ya está registrado");
        }

        if (existsAsCustomer || existsAsAuthor) {
            throw new BadRequestException("Ya existe un usuario con el mismo nombre y apellido");
        }


        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RoleNotFoundException("Rol no encontrado"));

        registrationDTO.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));

        User user = userMapper.toUserEntity(registrationDTO);
        user.setRole(role);

        if (roleEnum == ERole.CUSTOMER) {

            Customer customer = new Customer();
            customer.setFirstName(registrationDTO.getFirstName());
            customer.setLastName(registrationDTO.getLastName());
            customer.setShippingAddress(registrationDTO.getShippingAddress());
            customer.setCreatedAt(LocalDateTime.now());
            customer.setUser(user);
            user.setCustomer(customer);
        } else if (roleEnum == ERole.AUTHOR) {

            Author author = new Author();
            author.setFirstName(registrationDTO.getFirstName());
            author.setLastName(registrationDTO.getLastName());
            author.setBio(registrationDTO.getBio());
            author.setCreatedAt(LocalDateTime.now());
            author.setUser(user);
            user.setAuthor(author);
        }

        User savedUser = userRepository.save(user);

        return userMapper.toUserProfileDTO(savedUser);
    }


    @Transactional
    @Override
    public UserProfileDTO updateUserProfile(Integer id, UserProfileDTO userProfileDTO) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        boolean existsAsCustomer = customerRepository.existsByFirstNameAndLastNameAndUserIdNot(userProfileDTO.getFirstName(), userProfileDTO.getLastName(), id);
        boolean existsAsAuthor = authorRepository.existsByFirstNameAndLastNameAndUserIdNot(userProfileDTO.getFirstName(), userProfileDTO.getLastName(), id);

        if (existsAsCustomer || existsAsAuthor) {
            throw new BadRequestException("Ya existe un usuario con el mismo nombre y apellido");
        }

        if (userProfileDTO.getEmail() != null && !userProfileDTO.getEmail().equals(user.getEmail())) {
            boolean emailExists = userRepository.existsByEmail(userProfileDTO.getEmail());
            if (emailExists) {
                throw new BadRequestException("El email ya está en uso por otro usuario");
            }
            user.setEmail(userProfileDTO.getEmail());
        }

        if (userProfileDTO.getCurrentPassword() != null && userProfileDTO.getNewPassword() != null) {

            if (!passwordEncoder.matches(userProfileDTO.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("La contraseña actual es incorrecta");
            }

            if (passwordEncoder.matches(userProfileDTO.getNewPassword(), user.getPassword())) {
                throw new BadRequestException("La nueva contraseña debe ser diferente a la actual");
            }

            user.setPassword(passwordEncoder.encode(userProfileDTO.getNewPassword()));
        }

        if (user.getCustomer() != null) {
            user.getCustomer().setFirstName(userProfileDTO.getFirstName());
            user.getCustomer().setLastName(userProfileDTO.getLastName());
            user.getCustomer().setShippingAddress(userProfileDTO.getShippingAddress());
        }

        if (user.getAuthor() != null) {
            user.getAuthor().setFirstName(userProfileDTO.getFirstName());
            user.getAuthor().setLastName(userProfileDTO.getLastName());
            user.getAuthor().setBio(userProfileDTO.getBio());
        }

        User updatedUser = userRepository.save(user);

        return userMapper.toUserProfileDTO(updatedUser);
    }

    @Transactional
    @Override
    public UserProfileDTO getUserProfileById(Integer id) {

        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return userMapper.toUserProfileDTO(user);
    }
}
