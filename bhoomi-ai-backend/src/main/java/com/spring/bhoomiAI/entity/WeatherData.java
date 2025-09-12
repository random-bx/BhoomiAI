package com.spring.bhoomiAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "weather_data")
public class WeatherData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(name = "avg_rainfall_mm")
    private Double rainfall;
    @Column(name = "avg_temperature_celsius")
    private Double temperature;
    @Column(name = "avg_humidity_percent")
    private Double humidity;
    @CreationTimestamp
    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime date;
}