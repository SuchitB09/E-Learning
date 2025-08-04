package com.example.demo.dto;

import java.time.LocalDateTime;

public class EnrollmentDTO {
    private String userName;
    private String courseName;
    private double amount;
    private String status;
    private LocalDateTime createdAt;

    public EnrollmentDTO(String userName, String courseName, double amount, String status, LocalDateTime createdAt) {
        this.userName = userName;
        this.courseName = courseName;
        this.amount = amount;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
}
