-- Insert admin user (password: admin123)
INSERT IGNORE INTO users (username, password, email, role, created_at) VALUES 
('admin', '$2a$12$NiT8qZFgmLVQydNMp8me1.VPKQbuYk9lJFkCRwX9pZWVCuc00CFVC', 'admin@aptitude.com', 'ADMIN', NOW()),
('user1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVsUiC', 'user1@test.com', 'USER', NOW());

-- Insert sample questions with correct column names
INSERT IGNORE INTO questions (category, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, active, created_by) VALUES
('Quantitative', 'If a train travels 300 km in 5 hours, what is its speed?', '50 km/h', '60 km/h', '70 km/h', '80 km/h', 'B', 'Speed = Distance/Time = 300/5 = 60 km/h', 1, true, 'admin'),
('Logical', 'If all roses are flowers and some flowers fade quickly, which statement must be true?', 'All roses fade quickly', 'Some roses fade quickly', 'No roses fade quickly', 'Some flowers that fade quickly are roses', 'D', 'The given statements don''t guarantee that roses fade quickly, but some flowers that fade quickly could be roses.', 2, true, 'admin'),
('Verbal', 'Choose the word most similar to "Eloquent":', 'Fluent', 'Quiet', 'Rude', 'Simple', 'A', 'Eloquent means fluent or persuasive in speaking or writing.', 1, true, 'admin'),
('Quantitative', 'What is 15% of 200?', '15', '30', '25', '20', 'B', '15% of 200 = (15/100) * 200 = 30', 1, true, 'admin'),
('Technical', 'What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language', 'A', 'HTML stands for Hyper Text Markup Language', 1, true, 'admin'),
('Logical', 'If all cats are animals and some animals are pets, then:', 'All cats are pets', 'Some cats are pets', 'No cats are pets', 'Some pets are cats', 'D', 'We can only conclude that some pets are cats.', 2, true, 'admin'),
('Quantitative', 'Solve: 2x + 5 = 15', 'x = 5', 'x = 10', 'x = 7.5', 'x = 5.5', 'A', '2x + 5 = 15 → 2x = 10 → x = 5', 2, true, 'admin');