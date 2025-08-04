package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    private Long id;
    private String paymentIntentId;
    private String userName;
    private String courseName;
    private double amount;
    private String status;
    private LocalDateTime paymentDate;
}
