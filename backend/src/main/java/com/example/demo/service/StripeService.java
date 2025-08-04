package com.example.demo.service;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    public StripeService(@Value("${stripe.api.key}") String apiKey) {
        Stripe.apiKey = apiKey;
    }

    public String createPaymentIntent(int amountInCents) throws Exception {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) amountInCents)
                .setCurrency("inr")
                .build();

        PaymentIntent intent = PaymentIntent.create(params);
        return intent.getClientSecret();
    }
}
