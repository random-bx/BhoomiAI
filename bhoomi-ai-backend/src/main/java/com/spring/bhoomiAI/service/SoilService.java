package com.spring.bhoomiAI.service;

import com.spring.bhoomiAI.dto.request.SoilRequestDTO;
import com.spring.bhoomiAI.dto.response.SoilResponseDTO;
import java.util.List;

public interface SoilService {

    SoilResponseDTO saveSoilData(String userEmail, SoilRequestDTO requestDTO);

    List<SoilResponseDTO> getSoilHistoryForUser(String userEmail);
}