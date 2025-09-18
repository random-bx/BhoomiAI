package com.spring.bhoomiAI.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global configuration for the web layer of the application,
 * including Cross-Origin Resource Sharing (CORS).
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configures CORS settings for the entire application.
     * This is the standard way to handle CORS in Spring Boot.
     *
     * @param registry the CORS registry to configure.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // This line allows requests from ANY origin ("*").
        // For a production app, you would restrict this to your frontend's domain.
        // For the hackathon, "*" is perfect.
        registry.addMapping("/**") // Apply this rule to all endpoints ("/**")
                .allowedOrigins("*")   // Allow requests from any origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow these HTTP methods
                .allowedHeaders("*");  // Allow all headers
    }
}