package com.spring.bhoomiAI.controller;

import com.spring.bhoomiAI.dto.request.WeatherRequestDTO;
import com.spring.bhoomiAI.dto.response.WeatherResponseDTO;
import com.spring.bhoomiAI.service.WeatherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    /**
     * Endpoint for the user to MANUALLY submit weather data.
     * @param userEmail The email identifying the user.
     * @param request The DTO with weather details.
     * @return The created WeatherResponseDTO.
     */
    @PostMapping
    public ResponseEntity<WeatherResponseDTO> saveWeatherData(
            @RequestParam String userEmail,
            @Valid @RequestBody WeatherRequestDTO request) {
        WeatherResponseDTO response = weatherService.saveWeatherData(userEmail, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Endpoint to get the user's saved weather history.
     * @param userEmail The email identifying the user.
     * @return A list of historical weather data.
     */
    @GetMapping("/history")
    public ResponseEntity<List<WeatherResponseDTO>> getWeatherHistory(@RequestParam String userEmail) {
        List<WeatherResponseDTO> history = weatherService.getWeatherHistoryForUser(userEmail);
        return ResponseEntity.ok(history);
    }

    /**
     * Endpoint to AUTOMATICALLY fetch the current weather from WeatherAPI.com,
     * save it to the database, and return it.
     * @param userEmail The email identifying the user (to get their location).
     * @return The newly fetched and saved weather data.
     */
    @PostMapping("/fetch-current")
    public ResponseEntity<WeatherResponseDTO> fetchCurrentWeather(@RequestParam String userEmail) {
        WeatherResponseDTO response = weatherService.fetchAndSaveCurrentWeather(userEmail);
        return ResponseEntity.ok(response);
    }
}