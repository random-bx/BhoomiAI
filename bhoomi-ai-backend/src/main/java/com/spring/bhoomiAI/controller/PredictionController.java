package com.spring.bhoomiAI.controller;

import com.spring.bhoomiAI.dto.request.PredictionRequestDTO;
import com.spring.bhoomiAI.dto.response.PredictionResponseDTO;
import com.spring.bhoomiAI.service.PredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    /**
     * Initiates a new crop yield prediction for a specific user.
     * This endpoint calls the Python ML service.
     * @param userEmail The email identifying the user.
     * @param request The DTO containing all necessary parameters for the prediction.
     * @return The prediction result and recommendations.
     */
    @PostMapping
    public ResponseEntity<PredictionResponseDTO> makePrediction(
            @RequestParam String userEmail,
            @Valid @RequestBody PredictionRequestDTO request) {
        PredictionResponseDTO response = predictionService.makePrediction(userEmail, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Fetches the prediction history for a specific user.
     * @param userEmail The email identifying the user.
     * @return A list of all past predictions for that user.
     */
    @GetMapping("/history")
    public ResponseEntity<List<PredictionResponseDTO>> getPredictionHistory(@RequestParam String userEmail) {
        List<PredictionResponseDTO> history = predictionService.getPredictionHistoryForUser(userEmail);
        return ResponseEntity.ok(history);
    }
}