package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.entities.psql.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.VehicleApproveStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.scheduling.annotation.Async;

public interface EmailService {

    @Async
    void sendCreateAccountConformationEmailRequest(String to, String token);

    @Async
    void sendOTP(String email);

    @Async
    void sendVehicleApproveStatus(Vehicle vehicle, String email, VehicleApproveStatus status);

    void sendConformationEmail(@NotBlank @Email(message = "Invalid email format") String email, User user);

    void sendUpdateConformationEmail(String email, User user);
}
