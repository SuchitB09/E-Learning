package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entity.Assessment;
import com.example.demo.entity.Course;
import com.example.demo.entity.User;
import com.example.demo.repository.AssessmentRepository;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    public List<Assessment> getAssessmentsByUserAndCourse(User user, Course course) {
        return assessmentRepository.findByUserAndCourse(user, course);
    }

    public boolean hasAttempted(User user, Course course) {
        List<Assessment> assessments = getAssessmentsByUserAndCourse(user, course);
        return !assessments.isEmpty();
    }

    public List<Assessment> getAssessmentByUser(User user) {
        return assessmentRepository.findByUser(user);
    }

    public Assessment saveAssessment(User user, Course course, Assessment assessment) {
        assessment.setUser(user);
        assessment.setCourse(course);
        return assessmentRepository.save(assessment);
    }
}
