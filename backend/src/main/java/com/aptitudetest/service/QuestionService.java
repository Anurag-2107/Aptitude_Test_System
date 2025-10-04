package com.aptitudetest.service;

import com.aptitudetest.model.Question;
import com.aptitudetest.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
    
    public List<Question> getActiveQuestions() {
        return questionRepository.findByActiveTrue();
    }
    
    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }
    
    public List<Question> getQuestionsByCategory(String category) {
        return questionRepository.findByCategory(category);
    }
    
    public List<Question> getActiveQuestionsByCategory(String category) {
        return questionRepository.findByCategoryAndActiveTrue(category);
    }
    
    public List<Question> getQuestionsByDifficultyLevel(Integer difficultyLevel) {
        return questionRepository.findByDifficultyLevel(difficultyLevel);
    }
    
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }
    
    public Question updateQuestion(Long id, Question questionDetails) {
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            question.setCategory(questionDetails.getCategory());
            question.setQuestionText(questionDetails.getQuestionText());
            question.setOptionA(questionDetails.getOptionA());
            question.setOptionB(questionDetails.getOptionB());
            question.setOptionC(questionDetails.getOptionC());
            question.setOptionD(questionDetails.getOptionD());
            question.setCorrectAnswer(questionDetails.getCorrectAnswer());
            question.setExplanation(questionDetails.getExplanation());
            question.setDifficultyLevel(questionDetails.getDifficultyLevel());
            question.setActive(questionDetails.getActive());
            return questionRepository.save(question);
        }
        return null;
    }
    
    public boolean deleteQuestion(Long id) {
        if (questionRepository.existsById(id)) {
            questionRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean deactivateQuestion(Long id) {
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            question.setActive(false);
            questionRepository.save(question);
            return true;
        }
        return false;
    }
    
    public boolean activateQuestion(Long id) {
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            question.setActive(true);
            questionRepository.save(question);
            return true;
        }
        return false;
    }
}