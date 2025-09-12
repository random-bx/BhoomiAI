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
@Table(name = "soil_data")
public class SoilData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(name = "nitrogen_level")
    private Double n;
    @Column(name = "phosphorus_level")
    private Double p;
    @Column(name = "potassium_level")
    private Double k;
    private Double ph;
    @CreationTimestamp
    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime date;
}