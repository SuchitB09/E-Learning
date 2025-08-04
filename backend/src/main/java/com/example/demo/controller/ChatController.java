package com.example.demo.controller;

import com.example.demo.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000") // adjust for React frontend
public class ChatController {

    private final GeminiService geminiService;

    @Autowired
    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public Map<String, String> chatWithGemini(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");

        try {
            String reply = geminiService.generateResponse(userMessage);
            return Map.of("reply", reply);
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("reply", "Oops! Something went wrong while contacting Gemini.");
        }
    }
}
