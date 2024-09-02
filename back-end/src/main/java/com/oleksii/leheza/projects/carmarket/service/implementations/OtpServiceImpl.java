package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.repositories.OtpRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.EmailService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.OtpService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {
    private final OtpRepository otpRepository;
    private final EmailService emailService;

    @Override
    public Boolean existByPassword(int password) {
        return otpRepository.existsByPassword(password);
    }

    @Transactional
    @Override
    public void deleteOtp(int password) {
        otpRepository.deleteByPassword(password);
    }

    @Transactional
    @Override
    public void sendOTP(String email) {
        if (otpRepository.existsByUserEmail(email)) {
            otpRepository.deleteByUserEmail(email);
        }
        emailService.sendOTP(email);
    }
}
