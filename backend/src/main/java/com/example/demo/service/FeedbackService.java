package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.FeedbackRequest;
import com.example.demo.entity.Course;
import com.example.demo.entity.Feedback;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.FeedbackRepository;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Get all feedbacks for home page
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    // Get feedbacks for a course
    public List<Feedback> getFeedbacksForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course != null) {
            return course.getFeedbacks();
        }
        return null;
    }

    // Submit feedback for a course
    public String submitFeedback(FeedbackRequest fr) {
        Course course = courseRepository.findById(fr.getCourse_id()).orElse(null);
        Feedback feedback = new Feedback();

        if (course != null) {
            feedback.setCourse(course);
            feedback.setComment(fr.getComment());
            feedbackRepository.save(feedback);
            return "Feedback submitted successfully";
        }
        return "Feedback submission failed";
    }

    // Delete feedback by ID
    public String deleteFeedback(Long feedbackId) {
        if (feedbackRepository.existsById(feedbackId)) {
            feedbackRepository.deleteById(feedbackId);
            return "Feedback deleted successfully";
        }
        return "Feedback not found";
    }
}
