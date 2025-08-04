package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.FeedbackRequest;
import com.example.demo.entity.Feedback;
import com.example.demo.service.FeedbackService;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "http://localhost:3000")  // Allows requests from React frontend
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    //  Get ALL feedbacks (for home page display)
    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    // Get feedback for a course
    @GetMapping("/{courseId}")
    public List<Feedback> getFeedbacksForCourse(@PathVariable Long courseId) {
        return feedbackService.getFeedbacksForCourse(courseId);
    }

    // Submit feedback for a course
    @PostMapping
    public String submitFeedback(@RequestBody FeedbackRequest fr) {
        return feedbackService.submitFeedback(fr);
    }

    // Delete feedback by ID
    @DeleteMapping("/{feedbackId}")
    public String deleteFeedback(@PathVariable Long feedbackId) {
        return feedbackService.deleteFeedback(feedbackId);
    }
}
