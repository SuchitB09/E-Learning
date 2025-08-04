package com.example.demo.controller;

import com.example.demo.dto.EnrollmentDTO;
import com.example.demo.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping
    public List<EnrollmentDTO> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }
}
