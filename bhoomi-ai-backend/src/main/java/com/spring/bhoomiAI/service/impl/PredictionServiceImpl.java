package com.spring.bhoomiAI.service.impl;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.spring.bhoomiAI.dto.request.PredictionRequestDTO;
import com.spring.bhoomiAI.dto.response.PredictionResponseDTO;
import com.spring.bhoomiAI.entity.Prediction;
import com.spring.bhoomiAI.entity.User;
import com.spring.bhoomiAI.repository.PredictionRepository;
import com.spring.bhoomiAI.service.PredictionService;
import com.spring.bhoomiAI.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PredictionServiceImpl implements PredictionService {

    private final PredictionRepository predictionRepository;
    private final UserService userService;
    private final WebClient.Builder webClientBuilder;

    @Value("${ml.api.base-url}")
    private String mlApiBaseUrl;

    @Override
    public PredictionResponseDTO makePrediction(String userEmail, PredictionRequestDTO requestDTO) {
        User user = userService.findUserByEmail(userEmail);

        MlApiResponse mlResponse = webClientBuilder.build()
                .post()
                .uri(mlApiBaseUrl + "/predict")
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(MlApiResponse.class)
                .block();

        if (mlResponse == null) {
            throw new IllegalStateException("Failed to get a response from the prediction service.");
        }

        String recommendations = generateRuleBasedRecommendations(requestDTO, mlResponse);

        Prediction prediction = Prediction.builder()
                .user(user)
                .crop(requestDTO.getCrop())
                .predictedYield(mlResponse.getPredictedYieldKgHa())
                .recommendations(recommendations)
                .build();
        Prediction savedPrediction = predictionRepository.save(prediction);

        return mapEntityToResponseDTO(savedPrediction);
    }

    @Override
    public List<PredictionResponseDTO> getPredictionHistoryForUser(String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        return predictionRepository.findAllByUserOrderByDateDesc(user).stream()
                .map(this::mapEntityToResponseDTO)
                .collect(Collectors.toList());
    }

    private String generateRuleBasedRecommendations(PredictionRequestDTO request, MlApiResponse mlResponse) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("AI Prediction: Estimated yield for %s is %.2f kg/hectare.\n", request.getCrop(), mlResponse.getPredictedYieldKgHa()));

        if (request.getN() < 50) {
            sb.append("Recommendation: Soil Nitrogen is low. Consider applying a Nitrogen-rich fertilizer like Urea.\n");
        }
        if (request.getPh() < 6.0) {
            sb.append("Recommendation: Soil is acidic. Consider applying lime to raise the pH level.\n");
        } else if (request.getPh() > 7.5) {
            sb.append("Recommendation: Soil is alkaline. Consider applying sulfur or gypsum to lower the pH.\n");
        }
        sb.append("General advice: Ensure consistent irrigation and monitor for pests.");

        return sb.toString();
    }

    private PredictionResponseDTO mapEntityToResponseDTO(Prediction entity) {
        return PredictionResponseDTO.builder()
                .id(entity.getId())
                .crop(entity.getCrop())
                .predictedYield(entity.getPredictedYield())
                .recommendations(entity.getRecommendations())
                .date(entity.getDate())
                .build();
    }

    @Data
    private static class MlApiResponse {
        @JsonProperty("predicted_yield_kg_ha")
        private Double predictedYieldKgHa;

        @JsonProperty("confidence_score")
        private Double confidenceScore;
    }
}