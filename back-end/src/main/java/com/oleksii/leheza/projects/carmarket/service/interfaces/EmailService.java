package com.oleksii.leheza.projects.carmarket.service.interfaces;

import org.springframework.scheduling.annotation.Async;

public interface EmailService {

    @Async
    void sendConformationEmailRequest(String to, String token);

    @Async
    void sendOTP(String email);
}
