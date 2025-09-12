package com.spring.bhoomiAI.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String location;
}