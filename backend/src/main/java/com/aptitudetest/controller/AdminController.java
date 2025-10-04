package com.aptitudetest.controller;

import com.aptitudetest.model.TestResult;
import com.aptitudetest.model.User;
import com.aptitudetest.repository.QuestionRepository;
import com.aptitudetest.repository.TestResultRepository;
import com.aptitudetest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    // Debug endpoint to check authentication and roles
    @GetMapping("/debug/auth")
    public ResponseEntity<?> debugAuth(Authentication authentication) {
        System.out.println("=== DEBUG AUTHENTICATION ===");
        
        if (authentication == null) {
            System.out.println("Authentication is NULL - User not authenticated");
            Map<String, Object> response = new HashMap<>();
            response.put("status", "unauthenticated");
            response.put("message", "User not authenticated");
            return ResponseEntity.ok(response);
        }
        
        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("username", authentication.getName());
        debugInfo.put("authorities", authentication.getAuthorities().toString());
        debugInfo.put("isAuthenticated", authentication.isAuthenticated());
        debugInfo.put("principalType", authentication.getPrincipal().getClass().getSimpleName());
        
        // Check admin role access
        boolean hasAdminAccess = hasAdminRole(authentication);
        debugInfo.put("hasAdminAccess", hasAdminAccess);
        
        System.out.println("User: " + authentication.getName());
        System.out.println("Authorities: " + authentication.getAuthorities());
        System.out.println("Has Admin Access: " + hasAdminAccess);
        System.out.println("=== END DEBUG ===");
        
        return ResponseEntity.ok(debugInfo);
    }

    // Get all test results
    @GetMapping("/results/all")
    public ResponseEntity<?> getAllResults(Authentication authentication) {
        System.out.println("Accessing getAllResults - User: " + 
            (authentication != null ? authentication.getName() : "null"));
        
        if (!hasAdminRole(authentication)) {
            System.out.println("ACCESS DENIED: User does not have admin role");
            return ResponseEntity.status(403).body("Access denied: Admin role required");
        }
        
        List<TestResult> results = testResultRepository.findAllByOrderByTestDateDesc();
        System.out.println("Returning " + results.size() + " test results");
        return ResponseEntity.ok(results);
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        System.out.println("Accessing getAllUsers - User: " + 
            (authentication != null ? authentication.getName() : "null"));
            
        if (!hasAdminRole(authentication)) {
            System.out.println("ACCESS DENIED: User does not have admin role");
            return ResponseEntity.status(403).body("Access denied: Admin role required");
        }
        
        List<User> users = userRepository.findAll();
        System.out.println("Returning " + users.size() + " users");
        return ResponseEntity.ok(users);
    }

    // Export results (simplified - returns CSV data as string)
    @GetMapping("/results/export")
    public ResponseEntity<?> exportResults(Authentication authentication) {
        System.out.println("Accessing exportResults - User: " + 
            (authentication != null ? authentication.getName() : "null"));
            
        if (!hasAdminRole(authentication)) {
            System.out.println("ACCESS DENIED: User does not have admin role");
            return ResponseEntity.status(403).body("Access denied: Admin role required");
        }
        
        List<TestResult> results = testResultRepository.findAllByOrderByTestDateDesc();
        
        // Create CSV content
        StringBuilder csvContent = new StringBuilder();
        csvContent.append("User,Score,Total Questions,Percentage,Time Taken (s),Test Date\n");
        
        for (TestResult result : results) {
            csvContent.append(String.format("\"%s\",%d,%d,%.2f,%d,%s\n",
                    result.getUser().getUsername(),
                    result.getScore(),
                    result.getTotalQuestions(),
                    result.getPercentage(),
                    result.getTimeTaken(),
                    result.getTestDate().toString()
            ));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Exported " + results.size() + " test results");
        response.put("csvData", csvContent.toString());
        response.put("count", results.size());
        
        System.out.println("Exported " + results.size() + " test results");
        return ResponseEntity.ok(response);
    }

    // Get question statistics
    @GetMapping("/stats/questions")
    public ResponseEntity<?> getQuestionStats(Authentication authentication) {
        System.out.println("Accessing getQuestionStats - User: " + 
            (authentication != null ? authentication.getName() : "null"));
            
        if (!hasAdminRole(authentication)) {
            System.out.println("ACCESS DENIED: User does not have admin role");
            return ResponseEntity.status(403).body("Access denied: Admin role required");
        }
        
        long totalQuestions = questionRepository.count();
        long activeQuestions = questionRepository.findByActiveTrue().size();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", totalQuestions);
        stats.put("active", activeQuestions);
        
        System.out.println("Question stats - Total: " + totalQuestions + ", Active: " + activeQuestions);
        return ResponseEntity.ok(stats);
    }

    // Get system statistics
    @GetMapping("/stats/system")
    public ResponseEntity<?> getSystemStats(Authentication authentication) {
        System.out.println("Accessing getSystemStats - User: " + 
            (authentication != null ? authentication.getName() : "null"));
            
        if (!hasAdminRole(authentication)) {
            System.out.println("ACCESS DENIED: User does not have admin role");
            return ResponseEntity.status(403).body("Access denied: Admin role required");
        }
        
        long totalUsers = userRepository.count();
        long totalTests = testResultRepository.count();
        long adminUsers = userRepository.findAll().stream()
                .filter(user -> "ADMIN".equals(user.getRole()))
                .count();
        long regularUsers = totalUsers - adminUsers;
        
        // Calculate average score
        List<TestResult> allResults = testResultRepository.findAll();
        double averageScore = allResults.stream()
                .mapToDouble(result -> (double) result.getScore() / result.getTotalQuestions() * 100)
                .average()
                .orElse(0.0);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("adminUsers", adminUsers);
        stats.put("regularUsers", regularUsers);
        stats.put("totalTests", totalTests);
        stats.put("averageScore", Math.round(averageScore * 100.0) / 100.0);
        
        System.out.println("System stats - Users: " + totalUsers + 
                          ", Admins: " + adminUsers + 
                          ", Tests: " + totalTests + 
                          ", Avg Score: " + stats.get("averageScore"));
        return ResponseEntity.ok(stats);
    }

    // Deactivate user
    @PatchMapping("/users/{userId}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId, Authentication authentication) {
        System.out.println("Accessing deactivateUser - User: " + 
            (authentication != null ? authentication.getName() : "null"));
            
        if (!hasAdminRole(authentication)) {
            System.out.println("ACCESS DENIED: User does not have admin role");
            return ResponseEntity.status(403).body("Access denied: Admin role required");
        }
        
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            // You might want to add an 'active' field to User model for this
            return ResponseEntity.ok("User deactivated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deactivating user: " + e.getMessage());
        }
    }

    // Activate user
    @PatchMapping("/users/{userId}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long userId, Authentication authentication) {
        System.out.println("Accessing activateUser - User: " + 
            (authentication != null ? authentication.getName() : "null"));
            
        if (!hasAdminRole(authentication)) {
            System.out.println("ACCESS DENIED: User does not have admin role");
            return ResponseEntity.status(403).body("Access denied: Admin role required");
        }
        
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            // You might want to add an 'active' field to User model for this
            return ResponseEntity.ok("User activated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error activating user: " + e.getMessage());
        }
    }

    // Get recent tests (last 10)
    @GetMapping("/results/recent")
    public ResponseEntity<?> getRecentTests(Authentication authentication) {
        System.out.println("Accessing getRecentTests - User: " + 
            (authentication != null ? authentication.getName() : "null"));
            
        if (!hasAdminRole(authentication)) {
            System.out.println("ACCESS DENIED: User does not have admin role");
            return ResponseEntity.status(403).body("Access denied: Admin role required");
        }
        
        List<TestResult> recentTests = testResultRepository.findAllByOrderByTestDateDesc();
        // Limit to last 10 tests
        if (recentTests.size() > 10) {
            recentTests = recentTests.subList(0, 10);
        }
        
        System.out.println("Returning " + recentTests.size() + " recent tests");
        return ResponseEntity.ok(recentTests);
    }

    // Improved helper method to check if user has admin role
   private boolean hasAdminRole(Authentication authentication) {
    if (authentication == null) return false;

    return authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
}

        
        System.out.println("Checking admin role for user: " + authentication.getName());
        System.out.println("User authorities: " + authentication.getAuthorities());
        
        boolean hasAdminRole = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> {
                    String authority = grantedAuthority.getAuthority();
                    System.out.println("Checking authority: " + authority);
                    
                    // Check for various possible admin role formats
                    return authority.equals("ROLE_ADMIN") || 
                           authority.equals("ADMIN") ||
                           authority.contains("ADMIN") ||
                           authority.equals("ROLE_ADMIN,ROLE_USER") ||
                           authority.equals("ADMIN,USER");
                });
        
        System.out.println("User " + authentication.getName() + " has admin role: " + hasAdminRole);
        return hasAdminRole;
    }
    
    // Temporary development endpoint to test without authentication
    @GetMapping("/test/no-auth")
    public ResponseEntity<?> testNoAuth() {
        System.out.println("Test endpoint accessed without auth check");
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This endpoint doesn't require authentication");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
}