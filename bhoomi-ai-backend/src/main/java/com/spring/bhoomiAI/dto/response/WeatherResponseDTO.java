package com.spring.bhoomiAI.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class WeatherResponseDTO {

    private Long id;
    private Double rainfall;
    private Double temperature;
    private Double humidity;
    private LocalDateTime date;
}