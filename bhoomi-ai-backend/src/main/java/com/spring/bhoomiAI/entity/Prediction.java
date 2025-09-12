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
@Table(name = "predictions")
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false)
    private String crop;
    @Column(name = "predicted_yield_kg_ha")
    private Double predictedYield;
    @Column(columnDefinition = "TEXT")
    private String recommendations;
    @CreationTimestamp
    @Column(name = "predicted_at", updatable = false)
    private LocalDateTime date;
}