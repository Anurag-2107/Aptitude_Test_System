package com.aptitudetest.repository;

import com.aptitudetest.model.TestResult;
import com.aptitudetest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserOrderByTestDateDesc(User user);
    List<TestResult> findAllByOrderByTestDateDesc();
}