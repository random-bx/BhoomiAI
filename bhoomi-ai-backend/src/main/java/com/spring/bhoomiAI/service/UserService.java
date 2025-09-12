package com.spring.bhoomiAI.service;

import com.spring.bhoomiAI.dto.request.UserRequestDTO;
import com.spring.bhoomiAI.dto.response.UserResponseDTO;
import com.spring.bhoomiAI.entity.User;

public interface UserService {

    UserResponseDTO getOrCreateUser(UserRequestDTO requestDTO);

    User findUserByEmail(String email);
}