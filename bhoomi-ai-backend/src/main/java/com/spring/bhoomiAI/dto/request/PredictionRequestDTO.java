package com.spring.bhoomiAI.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PredictionRequestDTO {

    @NotBlank(message = "Crop name is required")
    private String crop;

    @NotNull(message = "Nitrogen value is required")
    private Double n;

    @NotNull(message = "Phosphorus value is required")
    private Double p;

    @NotNull(message = "Potassium value is required")
    private Double k;

    @NotNull(message = "pH value is required")
    private Double ph;

    @NotNull(message = "Temperature value is required")
    private Double temperature;

    @NotNull(message = "Humidity value is required")
    private Double humidity;

    @NotNull(message = "Rainfall value is required")
    private Double rainfall;
}