package com.spring.bhoomiAI.service.impl;

import com.spring.bhoomiAI.dto.request.SoilRequestDTO;
import com.spring.bhoomiAI.dto.response.SoilResponseDTO;
import com.spring.bhoomiAI.entity.SoilData;
import com.spring.bhoomiAI.entity.User;
import com.spring.bhoomiAI.repository.SoilRepository;
import com.spring.bhoomiAI.service.SoilService;
import com.spring.bhoomiAI.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SoilServiceImpl implements SoilService {

    private final SoilRepository soilRepository;
    private final UserService userService;

    @Override
    public SoilResponseDTO saveSoilData(String userEmail, SoilRequestDTO requestDTO) {
        User user = userService.findUserByEmail(userEmail);
        SoilData soilData = SoilData.builder()
                .user(user)
                .n(requestDTO.getN())
                .p(requestDTO.getP())
                .k(requestDTO.getK())
                .ph(requestDTO.getPh())
                .build();

        SoilData savedData = soilRepository.save(soilData);
        return mapEntityToResponseDTO(savedData);
    }

    @Override
    public List<SoilResponseDTO> getSoilHistoryForUser(String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        return soilRepository.findAllByUserOrderByDateDesc(user).stream()
                .map(this::mapEntityToResponseDTO)
                .collect(Collectors.toList());
    }

    private SoilResponseDTO mapEntityToResponseDTO(SoilData entity) {
        return SoilResponseDTO.builder()
                .id(entity.getId())
                .n(entity.getN())
                .p(entity.getP())
                .k(entity.getK())
                .ph(entity.getPh())
                .date(entity.getDate())
                .build();
    }
}