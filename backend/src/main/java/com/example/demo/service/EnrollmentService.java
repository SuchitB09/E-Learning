package com.example.demo.service;

import com.example.demo.dto.EnrollmentDTO;
import com.example.demo.entity.Enrollment;
import com.example.demo.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public List<EnrollmentDTO> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        return enrollments.stream()
                .map(e -> new EnrollmentDTO(
                        e.getUser().getUsername(), // Assuming `name` is the User field
                        e.getCourse().getCourseName(), // Assuming `title` is the Course field
                        e.getAmount(),
                        e.getStatus(),
                        e.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
