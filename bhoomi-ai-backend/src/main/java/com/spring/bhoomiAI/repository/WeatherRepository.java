package com.spring.bhoomiAI.repository;
import com.spring.bhoomiAI.entity.User;
import com.spring.bhoomiAI.entity.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface WeatherRepository extends JpaRepository<WeatherData, Long> {
    List<WeatherData> findAllByUserOrderByDateDesc(User user);
}