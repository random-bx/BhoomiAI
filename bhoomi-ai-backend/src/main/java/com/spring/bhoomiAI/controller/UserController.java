package com.spring.bhoomiAI.controller;

import com.spring.bhoomiAI.dto.request.UserRequestDTO;
import com.spring.bhoomiAI.dto.response.UserResponseDTO;
import com.spring.bhoomiAI.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Finds a user by email, or creates a new one if they don't exist.
     * This is the primary endpoint for user identification.
     * @param requestDTO DTO containing the user's name, email, and location.
     * @return The full user details, whether they were found or newly created.
     */
    @PostMapping("/identify")
    public ResponseEntity<UserResponseDTO> identifyUser(@Valid @RequestBody UserRequestDTO requestDTO) {
        UserResponseDTO userResponse = userService.getOrCreateUser(requestDTO);
        return ResponseEntity.ok(userResponse);
    }
}