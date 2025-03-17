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
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
    private static final String CREATE_NEW_PASSWORD = "Write this number at the application";
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final EmailConfirmationRepository confirmationRepository;

    @Async
    public void sendCreateAccountConformationEmailRequest(String to, String token) {
        try {
            log.info("Start sending confirmation request to user {}", to);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            messageHelper.setFrom(USER_EMAIL); // TODO prod input "from" variable
            messageHelper.setTo(USER_EMAIL);  // TODO prod input "to" variable
            messageHelper.setSubject(NEW_USER_ACCOUNT_VERIFICATION_SUBJECT);
            String confirmLink = getCreateUserEmailMessage("http://auto-market-frontend:3000", token);//TODO change path
            String emailContent = String.format(
                    "Dear user,<br><br>" +
                            "Please click the following link to confirm your account:<br>" +
                            "<a href=\"%s\">Confirm your account</a><br><br>" +
                            "Thank you!",
                    confirmLink
            );
            messageHelper.setText(emailContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully to user {}", to);
        } catch (SmtpException | MessagingException e) {
            throw new SmtpException("Could not send OTP to user " + to);
        }
    }

    @Async
    public void sendUpdateAccountConformationEmailRequest(String to, String token) {
        try {
            log.info("Start sending confirmation request to user {}", to);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            messageHelper.setFrom(USER_EMAIL); // TODO prod input "from" variable
            messageHelper.setTo(USER_EMAIL);  // TODO prod input "to" variable
            messageHelper.setSubject(UPDATE_USER_ACCOUNT_VERIFICATION_SUBJECT);
            String confirmLink = getUpdateUserEmailMessage("http://auto-market-frontend:3000", token);//TODO change path
            String emailContent = String.format(
                    "Dear user,<br><br>" +
                            "Please click the following link to confirm your new email:<br>" +
                            "<a href=\"%s\">Confirm your email</a><br><br>" +
                            "Thank you!",
                    confirmLink
            );
            messageHelper.setText(emailContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully to user {}", to);
        } catch (SmtpException | MessagingException e) {
            throw new SmtpException("Could not send OTP to user " + to);
        }
    }

    private String getCreateUserEmailMessage(String host, String token) {
        return getVerificationUrl(host, token);
    }

    private String getUpdateUserEmailMessage(String host, String token) {
        return getVerificationUrl(host, token);
    }

    @Async
    @Override
    public void sendOTP(String email) {
        try {
            log.info("Start sending otp to user {}", email);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            messageHelper.setFrom(USER_EMAIL); // TODO prod input "from" variable
            messageHelper.setTo(USER_EMAIL);  // TODO prod input "to" variable
            messageHelper.setSubject(CREATE_NEW_PASSWORD);
            OtpToken otp = new OtpToken(userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new ResourceNotFoundException("user with email " + email + " does not found")));
            otpRepository.save(otp);
            String emailContent = String.format(
                    "Write this number to the application<br><br>" +
                            Integer.toString(otp.getPassword()) + "<br><br>\n" + "Thank you!");
            messageHelper.setText(emailContent, true);
            mailSender.send(mimeMessage);
            log.info("Sent OTP to user {}", email);
        } catch (SmtpException | MessagingException e) {
            throw new SmtpException("Could not send OTP to user " + email);
        }
    }

    @Async
    @Override
    public void sendVehicleApproveStatus(Vehicle vehicle, String email, VehicleApproveStatus status) {
        try {
            log.info("Start sending vehicle approve message to user {}", email);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            messageHelper.setFrom(USER_EMAIL); // TODO prod input "from" variable
            messageHelper.setTo(USER_EMAIL);  // TODO prod input "to" variable
            messageHelper.setSubject(VEHICLE_APPROVED_STATUS_MESSAGE);
            OtpToken otp = new OtpToken(userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new ResourceNotFoundException("user with email " + email + " does not found")));
            otpRepository.save(otp);
            String emailContent = String.format("Your vehicle (" + vehicle.getVehicleModel().getModelName() + ") was " + status.name());
            messageHelper.setText(emailContent, true);
            mailSender.send(mimeMessage);
            log.info("Sent vehicle approve message {}", email);
        } catch (SmtpException | MessagingException e) {
            throw new SmtpException("Could not send OTP to user " + email);
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
