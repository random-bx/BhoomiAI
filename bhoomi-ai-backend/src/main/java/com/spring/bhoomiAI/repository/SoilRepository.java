package com.spring.bhoomiAI.repository;
import com.spring.bhoomiAI.entity.SoilData;
import com.spring.bhoomiAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface SoilRepository extends JpaRepository<SoilData, Long> {
    List<SoilData> findAllByUserOrderByDateDesc(User user);
}