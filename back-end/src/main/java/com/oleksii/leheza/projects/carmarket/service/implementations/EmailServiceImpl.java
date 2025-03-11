package com.oleksii.leheza.projects.carmarket.service.implementations;


import com.oleksii.leheza.projects.carmarket.entities.psql.EmailConfirmation;
import com.oleksii.leheza.projects.carmarket.entities.psql.OtpToken;
import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.entities.psql.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.VehicleApproveStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.exceptions.SmtpException;
import com.oleksii.leheza.projects.carmarket.repositories.sql.EmailConfirmationRepository;
import com.oleksii.leheza.projects.carmarket.repositories.sql.OtpRepository;
import com.oleksii.leheza.projects.carmarket.repositories.sql.UserRepository;
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
    private static final String NEW_USER_ACCOUNT_VERIFICATION_SUBJECT = "New User Account Verification";
    private static final String UPDATE_USER_ACCOUNT_VERIFICATION_SUBJECT = "Update User Account Verification";
    private static final String VEHICLE_APPROVED_STATUS_MESSAGE = "Vehicle Approved Status";
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final EmailConfirmationRepository confirmationRepository;

    @Async
    public void sendCreateAccountConformationEmailRequest(String to, String token) {
        try {
            log.info("Start sending confirmation request to user {}", to);
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(USER_EMAIL);//TODO prod input "from" variable
            simpleMailMessage.setTo(USER_EMAIL);//TODO prod input "to" variable
            simpleMailMessage.setSubject(NEW_USER_ACCOUNT_VERIFICATION_SUBJECT);
            simpleMailMessage.setText(getCreateUserEmailMessage("http://localhost:3000", token));//TODO change path
            mailSender.send(simpleMailMessage);
            log.info("Email ");
        } catch (SmtpException e) {
            throw new SmtpException("Could not send OTP to user " + to);
        }
    }

    @Async
    public void sendUpdateAccountConformationEmailRequest(String to, String token) {
        try {
            log.info("Start sending confirmation request to user {}", to);
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(USER_EMAIL);//TODO prod input "from" variable
            simpleMailMessage.setTo(USER_EMAIL);//TODO prod input "to" variable
            simpleMailMessage.setSubject(UPDATE_USER_ACCOUNT_VERIFICATION_SUBJECT);
            simpleMailMessage.setText(getUpdateUserEmailMessage("http://localhost:3000", token));//TODO change path
            mailSender.send(simpleMailMessage);
            log.info("Email ");
        } catch (SmtpException e) {
            throw new SmtpException("Could not send OTP to user " + to);
        }
    }

    private String getCreateUserEmailMessage(String host, String token) {
        return "Your new account has been created. Please click the link below to verify your account. \n\n" +
                getVerificationUrl(host, token) + "\n\nThe support Team";
    }

    private String getUpdateUserEmailMessage(String host, String token) {
        return "Your account email has been updated. Please click the link below to verify your account. \n\n" +
                getVerificationUrl(host, token) + "\n\nThe support Team";
    }

    @Async
    @Override
    public void sendOTP(String email) {
        try {
            log.info("Start sending OTP to user {}", email);
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(USER_EMAIL);//TODO prod input "from" variable
            simpleMailMessage.setTo(USER_EMAIL);//TODO prod input to variable
            simpleMailMessage.setSubject(NEW_USER_ACCOUNT_VERIFICATION_SUBJECT);
            OtpToken otp = new OtpToken(userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new ResourceNotFoundException("user with email " + email + " does not found")));
            otpRepository.save(otp);
            simpleMailMessage.setText(Integer.toString(otp.getPassword()));
            mailSender.send(simpleMailMessage);
            log.info("Sent OTP to user {}", email);
        } catch (SmtpException e) {
            throw new SmtpException("Could not send OTP to user " + email);
        }
    }

    @Async
    @Override
    public void sendVehicleApproveStatus(Vehicle vehicle, String email, VehicleApproveStatus status) {
        try {
            log.info("Start sending vehicle approve message {}", email);
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(USER_EMAIL);//TODO prod input "from" variable
            simpleMailMessage.setTo(USER_EMAIL);//TODO prod input to variable
            simpleMailMessage.setSubject(VEHICLE_APPROVED_STATUS_MESSAGE);
            simpleMailMessage.setText("Your vehicle ("+ vehicle.getBrand().getBrandName()+" "+ vehicle.getVehicleModel().getModelName()+") was " + status.name());
            mailSender.send(simpleMailMessage);
            log.info("Sent vehicle approve message {}", email);
        } catch (SmtpException e) {
            throw new SmtpException("Could not send vehicle approve message " + email);
        }
    }

    @Override
    public void sendConformationEmail(String email, User user) {
        EmailConfirmation confirmation = new EmailConfirmation(user);
        confirmationRepository.save(confirmation);
        sendCreateAccountConformationEmailRequest(email, confirmation.getToken());
    }

    @Override
    public void sendUpdateConformationEmail(String email, User user) {
        EmailConfirmation confirmation = new EmailConfirmation(user);
        confirmationRepository.save(confirmation);
        sendUpdateAccountConformationEmailRequest(email, confirmation.getToken());
    }

    public String getVerificationUrl(String host, String token) {
        return host + "/confirm-email?token=" + token;
    }
}
