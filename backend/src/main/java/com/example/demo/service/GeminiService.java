package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;


@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    private final String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();

    public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        this.apiKey = apiKey;
    }

    public String generateResponse(String prompt) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "API key is missing or not configured.";
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> message = Map.of("parts", List.of(part));
        Map<String, Object> request = Map.of("contents", List.of(message));

        try {
            Map response = restTemplate.postForObject(url, request, Map.class);

            if (response == null || !response.containsKey("candidates")) {
                return "No response received from Gemini.";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates.isEmpty()) {
                return "No candidates found in Gemini response.";
            }

            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");

            return parts.get(0).get("text");

        } catch (Exception e) {
            logger.error("Failed to parse Gemini response", e);
            return "An error occurred while processing Gemini's response.";
        }
    }
}
