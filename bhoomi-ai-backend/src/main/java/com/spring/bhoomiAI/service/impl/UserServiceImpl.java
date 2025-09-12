package com.spring.bhoomiAI.service.impl;

import com.spring.bhoomiAI.dto.request.UserRequestDTO;
import com.spring.bhoomiAI.dto.response.UserResponseDTO;
import com.spring.bhoomiAI.entity.User;
import com.spring.bhoomiAI.exception.ResourceNotFoundException;
import com.spring.bhoomiAI.repository.UserRepository;
import com.spring.bhoomiAI.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponseDTO getOrCreateUser(UserRequestDTO requestDTO) {
        User user = userRepository.findByEmail(requestDTO.getEmail())
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .name(requestDTO.getName())
                            .email(requestDTO.getEmail())
                            .location(requestDTO.getLocation())
                            .build();
                    return userRepository.save(newUser);
                });
        return mapEntityToResponseDTO(user);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private UserResponseDTO mapEntityToResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .location(user.getLocation())
                .build();
    }
}