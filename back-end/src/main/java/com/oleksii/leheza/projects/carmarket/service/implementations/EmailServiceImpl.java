package com.oleksii.leheza.projects.carmarket.service.implementations;


import com.oleksii.leheza.projects.carmarket.entities.OtpToken;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.OtpRepository;
import com.oleksii.leheza.projects.carmarket.repositories.UserRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private static final String USER_EMAIL = "leheza.oleksii@gmail.com";
    private static final String NEW_USER_ACCOUNT_VERIFICATION = "New User Account Verification";
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final OtpRepository otpRepository;

    @Async
    @Override
    public void sendConformationEmailRequest(String to, String token) {
        log.info("Start sending confirmation request to user {}", to);
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(USER_EMAIL);//TODO prod input "from" variable
        simpleMailMessage.setTo(USER_EMAIL);//TODO prod input "to" variable
        simpleMailMessage.setSubject(NEW_USER_ACCOUNT_VERIFICATION);
        simpleMailMessage.setText(getEmailMessage("http://localhost:3000", token));//TODO change path
        mailSender.send(simpleMailMessage);
        log.info("Email ");
    }

    private String getEmailMessage(String host, String token) {
        return "Your new account has been created. Please click the link below to verify your account. \n\n" +
                getVerificationUrl(host, token) + "\n\nThe support Team";
    }

    @Async
    @Override
    public void sendOTP(String email) {
        log.info("Start sending OTP to user {}", email);
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(USER_EMAIL);//TODO prod input "from" variable
        simpleMailMessage.setTo(USER_EMAIL);//TODO prod input to variable
        simpleMailMessage.setSubject(NEW_USER_ACCOUNT_VERIFICATION);
        OtpToken otp = new OtpToken(userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("user with email " + email + " does not found")));
        otpRepository.save(otp);
        simpleMailMessage.setText(Integer.toString(otp.getPassword()));
        mailSender.send(simpleMailMessage);
        log.info("Sent OTP to user {}", email);
    }

    public String getVerificationUrl(String host, String token) {
        return host + "/confirm-email?token=" + token;
    }
}
