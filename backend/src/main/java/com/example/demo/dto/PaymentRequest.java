package com.example.demo.dto;

public class PaymentRequest {
    private String paymentIntentId;  // maps to clientSecret in Payment
    private Long courseId;
    private int amount;
    private Long userId; // Optional: add if you want to track user payments

    // Getters and setters
    public String getPaymentIntentId() {
        return paymentIntentId;
    }

    public void setPaymentIntentId(String paymentIntentId) {
        this.paymentIntentId = paymentIntentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
