package com.aptitudetest.service;

import com.aptitudetest.model.TestResult;
import com.aptitudetest.model.User;
import com.aptitudetest.repository.TestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TestResultService {
    
    @Autowired
    private TestResultRepository testResultRepository;
    
    public TestResult saveTestResult(TestResult testResult) {
        return testResultRepository.save(testResult);
    }
    
    public List<TestResult> getUserTestResults(User user) {
        return testResultRepository.findByUserOrderByTestDateDesc(user);
    }
    
    public List<TestResult> getAllTestResults() {
        return testResultRepository.findAllByOrderByTestDateDesc();
    }
}