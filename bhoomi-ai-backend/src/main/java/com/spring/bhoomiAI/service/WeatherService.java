package com.spring.bhoomiAI.service;

import com.spring.bhoomiAI.dto.request.WeatherRequestDTO;
import com.spring.bhoomiAI.dto.response.WeatherResponseDTO;
import java.util.List;

public interface WeatherService {

    WeatherResponseDTO saveWeatherData(String userEmail, WeatherRequestDTO requestDTO);

    List<WeatherResponseDTO> getWeatherHistoryForUser(String userEmail);

    WeatherResponseDTO fetchAndSaveCurrentWeather(String userEmail);
}