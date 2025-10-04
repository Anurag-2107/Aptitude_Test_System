package com.aptitudetest.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "test_results")
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private Integer score;
    private Integer totalQuestions;
    private Double percentage;
    private Integer timeTaken; // in seconds
    private LocalDateTime testDate;
    
    @ElementCollection
    @CollectionTable(name = "test_answers", joinColumns = @JoinColumn(name = "test_result_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "user_answer")
    private Map<Long, String> userAnswers = new HashMap<>();
    
    // Constructors
    public TestResult() {
        this.testDate = LocalDateTime.now();
    }
    
    public TestResult(User user, Integer score, Integer totalQuestions, Integer timeTaken) {
        this();
        this.user = user;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.percentage = (double) score / totalQuestions * 100;
        this.timeTaken = timeTaken;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    
    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
    
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    
    public Integer getTimeTaken() { return timeTaken; }
    public void setTimeTaken(Integer timeTaken) { this.timeTaken = timeTaken; }
    
    public LocalDateTime getTestDate() { return testDate; }
    public void setTestDate(LocalDateTime testDate) { this.testDate = testDate; }
    
    public Map<Long, String> getUserAnswers() { return userAnswers; }
    public void setUserAnswers(Map<Long, String> userAnswers) { this.userAnswers = userAnswers; }
}