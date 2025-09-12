package com.spring.bhoomiAI.repository;
import com.spring.bhoomiAI.entity.Prediction;
import com.spring.bhoomiAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findAllByUserOrderByDateDesc(User user);
}