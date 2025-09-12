package com.spring.bhoomiAI.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.spring.bhoomiAI.dto.request.WeatherRequestDTO;
import com.spring.bhoomiAI.dto.response.WeatherResponseDTO;
import com.spring.bhoomiAI.entity.User;
import com.spring.bhoomiAI.entity.WeatherData;
import com.spring.bhoomiAI.repository.WeatherRepository;
import com.spring.bhoomiAI.service.UserService;
import com.spring.bhoomiAI.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService {

    private final WeatherRepository weatherRepository;
    private final UserService userService;
    private final WebClient.Builder webClientBuilder;

    @Value("${weatherapi.api.key}")
    private String weatherApiKey;
    @Value("${weatherapi.api.url}")
    private String weatherApiUrl;

    @Override
    public WeatherResponseDTO saveWeatherData(String userEmail, WeatherRequestDTO requestDTO) {
        User user = userService.findUserByEmail(userEmail);
        WeatherData weatherData = WeatherData.builder()
                .user(user)
                .rainfall(requestDTO.getRainfall())
                .temperature(requestDTO.getTemperature())
                .humidity(requestDTO.getHumidity())
                .build();
        WeatherData savedData = weatherRepository.save(weatherData);
        return mapEntityToResponseDTO(savedData);
    }

    @Override
    public List<WeatherResponseDTO> getWeatherHistoryForUser(String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        return weatherRepository.findAllByUserOrderByDateDesc(user).stream()
                .map(this::mapEntityToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WeatherResponseDTO fetchAndSaveCurrentWeather(String userEmail) {
        User user = userService.findUserByEmail(userEmail);
        if (user.getLocation() == null || user.getLocation().isEmpty()) {
            throw new IllegalStateException("User location is not set. Cannot fetch weather.");
        }

        JsonNode response = webClientBuilder.build()
                .get()
                .uri(weatherApiUrl, uriBuilder -> uriBuilder
                        .queryParam("key", weatherApiKey)
                        .queryParam("q", user.getLocation())
                        .queryParam("aqi", "no")
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null || response.has("error")) {
            String errorMessage = response != null ? response.path("error").path("message").asText() : "Unknown error";
            throw new RuntimeException("Failed to fetch weather data from WeatherAPI.com: " + errorMessage);
        }

        JsonNode current = response.path("current");
        double temperature = current.path("temp_c").asDouble();
        double humidity = current.path("humidity").asDouble();
        double rainfall = current.path("precip_mm").asDouble();

        WeatherData newWeatherData = WeatherData.builder()
                .user(user)
                .temperature(temperature)
                .humidity(humidity)
                .rainfall(rainfall)
                .build();

        WeatherData savedData = weatherRepository.save(newWeatherData);
        return mapEntityToResponseDTO(savedData);
    }

    private WeatherResponseDTO mapEntityToResponseDTO(WeatherData entity) {
        return WeatherResponseDTO.builder()
                .id(entity.getId())
                .rainfall(entity.getRainfall())
                .temperature(entity.getTemperature())
                .humidity(entity.getHumidity())
                .date(entity.getDate())
                .build();
    }
}