package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.Assessment;
import com.example.demo.entity.Course;
import com.example.demo.entity.User;
import com.example.demo.service.AssessmentService;
import com.example.demo.service.CourseService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;

    // ✅ Get all assessments by user and course
    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<List<Assessment>> getAssessmentsByUserAndCourse(
            @PathVariable Long userId,
            @PathVariable Long courseId) {

        User user = userService.getUserById(userId);
        Course course = courseService.getCourseById(courseId);

        List<Assessment> assessments = assessmentService.getAssessmentsByUserAndCourse(user, course);
        return ResponseEntity.ok(assessments);
    }

    // ✅ Get all assessments by user
    @GetMapping("/perfomance/{userId}")
    public ResponseEntity<List<Assessment>> getAssessmentsByUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        List<Assessment> assessments = assessmentService.getAssessmentByUser(user);
        return ResponseEntity.ok(assessments);
    }

    // ✅ Check if user has already attempted this course
    @GetMapping("/checkAttempt/{userId}/{courseId}")
    public ResponseEntity<Boolean> checkIfAttempted(
            @PathVariable Long userId,
            @PathVariable Long courseId) {

        User user = userService.getUserById(userId);
        Course course = courseService.getCourseById(courseId);

        boolean attempted = assessmentService.hasAttempted(user, course);
        return ResponseEntity.ok(attempted);
    }

    // ✅ Add assessment if not already attempted
    @PostMapping("/add/{userId}/{courseId}")
    public ResponseEntity<?> addAssessmentWithMarks(
            @PathVariable Long userId,
            @PathVariable Long courseId,
            @RequestBody Assessment assessment) {

        User user = userService.getUserById(userId);
        Course course = courseService.getCourseById(courseId);

        if (assessmentService.hasAttempted(user, course)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("You have already attempted this quiz for the course.");
        }

        Assessment savedAssessment = assessmentService.saveAssessment(user, course, assessment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAssessment);
    }
}
