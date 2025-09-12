package com.spring.bhoomiAI.controller;

import com.spring.bhoomiAI.dto.request.SoilRequestDTO;
import com.spring.bhoomiAI.dto.response.SoilResponseDTO;
import com.spring.bhoomiAI.service.SoilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/soil")
@RequiredArgsConstructor
public class SoilController {

    private final SoilService soilService;

    /**
     * Submits new soil data for a specific user.
     * @param userEmail The email identifying the user.
     * @param request The DTO with N, P, K, pH values.
     * @return The created SoilResponseDTO with a 201 status.
     */
    @PostMapping
    public ResponseEntity<SoilResponseDTO> submitSoilData(
            @RequestParam String userEmail,
            @Valid @RequestBody SoilRequestDTO request) {
        SoilResponseDTO response = soilService.saveSoilData(userEmail, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Fetches the soil data history for a specific user.
     * @param userEmail The email identifying the user.
     * @return A list of all historical soil data entries for that user.
     */
    @GetMapping("/history")
    public ResponseEntity<List<SoilResponseDTO>> getSoilHistory(@RequestParam String userEmail) {
        List<SoilResponseDTO> history = soilService.getSoilHistoryForUser(userEmail);
        return ResponseEntity.ok(history);
    }
}