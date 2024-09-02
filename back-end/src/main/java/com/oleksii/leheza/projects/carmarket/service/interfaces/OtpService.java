package com.oleksii.leheza.projects.carmarket.service.interfaces;

import jakarta.transaction.Transactional;

public interface OtpService {

    Boolean existByPassword(int password);

    @Transactional
    void deleteOtp(int password);

    @Transactional
    void sendOTP(String email);
}


