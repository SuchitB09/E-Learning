package com.example.demo.controller;

import com.example.demo.entity.Payment;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.service.CourseService;
import com.example.demo.service.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For dev — tighten in production
public class PaymentController {

    @Autowired
    private StripeService stripeService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * ✅ Create Stripe PaymentIntent
     */
    @PostMapping("/payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> data) {
        try {
            Long courseId = Long.parseLong(data.get("courseId").toString());
            int amount = courseService.getCoursePriceById(courseId);

            if (amount <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid course ID or price"));
            }

            String clientSecret = stripeService.createPaymentIntent(amount);
            return ResponseEntity.ok(Map.of("clientSecret", clientSecret));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Payment intent creation failed: " + e.getMessage()));
        }
    }

    /**
     * ✅ Save Payment Details After Success
     */
    @PostMapping("/payments")
    public ResponseEntity<?> savePayment(@RequestBody Map<String, Object> paymentData) {
        try {
            Payment payment = new Payment();
            payment.setPaymentIntentId(paymentData.get("paymentIntentId").toString());
            payment.setUserId(Long.parseLong(paymentData.get("userId").toString()));
            payment.setCourseId(Long.parseLong(paymentData.get("courseId").toString()));
            payment.setAmount(Double.parseDouble(paymentData.get("amount").toString()));
            payment.setStatus(paymentData.get("status").toString());
            payment.setPaymentDate(LocalDateTime.now());

            Payment savedPayment = paymentRepository.save(payment);
            return ResponseEntity.ok(savedPayment);

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Failed to save payment: " + e.getMessage()));
        }
    }

    /**
     * ✅ Admin: Get All Payments
     */
    @GetMapping("/payments")
    public ResponseEntity<?> getAllPayments() {
        try {
            List<Payment> payments = paymentRepository.findAll();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of("error", "Failed to retrieve payments: " + e.getMessage()));
        }
    }
}
