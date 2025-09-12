package com.spring.bhoomiAI.service;

import com.spring.bhoomiAI.dto.request.PredictionRequestDTO;
import com.spring.bhoomiAI.dto.response.PredictionResponseDTO;
import java.util.List;

public interface PredictionService {

    PredictionResponseDTO makePrediction(String userEmail, PredictionRequestDTO requestDTO);

    List<PredictionResponseDTO> getPredictionHistoryForUser(String userEmail);
}