package com.aptitudetest.controller;

import com.aptitudetest.model.Question;
import com.aptitudetest.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {
    
    @Autowired
    private QuestionService questionService;
    
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // ✅ New endpoint: Only active questions (used in TakeTest)
    @GetMapping("/active")
    public List<Question> getActiveQuestions() {
        return questionService.getActiveQuestions();
    }

    // 🔹 NEW: Activate all questions (for testing / showing in TakeTest)
    @GetMapping("/activateAll")
    public ResponseEntity<String> activateAllQuestions() {
        List<Question> allQuestions = questionService.getAllQuestions();
        for (Question q : allQuestions) {
            if (!q.isActive()) {
                q.setActive(true);
                questionService.createQuestion(q); // save updated question
            }
        }
        return ResponseEntity.ok("All questions activated!");
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        Optional<Question> question = questionService.getQuestionById(id);
        if (question.isPresent()) {
            return ResponseEntity.ok(question.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/category/{category}")
    public List<Question> getQuestionsByCategory(@PathVariable String category) {
        return questionService.getQuestionsByCategory(category);
    }
    
    @PostMapping
    public Question createQuestion(@RequestBody Question question) {
        return questionService.createQuestion(question);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question questionDetails) {
        Question updatedQuestion = questionService.updateQuestion(id, questionDetails);
        if (updatedQuestion != null) {
            return ResponseEntity.ok(updatedQuestion);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        if (questionService.deleteQuestion(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
