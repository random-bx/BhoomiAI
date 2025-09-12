package com.spring.bhoomiAI.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SoilResponseDTO {

    private Long id;
    private Double n;
    private Double p;
    private Double k;
    private Double ph;
    private LocalDateTime date;
}