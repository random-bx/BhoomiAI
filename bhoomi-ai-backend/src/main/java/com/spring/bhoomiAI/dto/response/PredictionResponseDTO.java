package com.spring.bhoomiAI.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PredictionResponseDTO {

    private Long id;
    private String crop;
    private Double predictedYield;
    private String recommendations;
    private LocalDateTime date;
}