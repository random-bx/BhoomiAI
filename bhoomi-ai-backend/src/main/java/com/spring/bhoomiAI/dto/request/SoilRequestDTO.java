package com.spring.bhoomiAI.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SoilRequestDTO {

    @NotNull(message = "Nitrogen value is required")
    private Double n;

    @NotNull(message = "Phosphorus value is required")
    private Double p;

    @NotNull(message = "Potassium value is required")
    private Double k;

    @NotNull(message = "pH value is required")
    private Double ph;
}