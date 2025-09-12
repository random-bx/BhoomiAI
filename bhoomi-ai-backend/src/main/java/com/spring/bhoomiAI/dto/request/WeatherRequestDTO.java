package com.spring.bhoomiAI.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WeatherRequestDTO {

    @NotNull(message = "Rainfall value is required")
    private Double rainfall;

    @NotNull(message = "Temperature value is required")
    private Double temperature;

    @NotNull(message = "Humidity value is required")
    private Double humidity;
}