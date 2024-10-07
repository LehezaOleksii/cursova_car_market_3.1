package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.VehicleApproveStatus;
import org.springframework.scheduling.annotation.Async;

public interface EmailService {

    @Async
    void sendConformationEmailRequest(String to, String token);

    @Async
    void sendOTP(String email);

    @Async
    void sendVehicleApproveStatus(Vehicle vehicle, String email, VehicleApproveStatus status);
}
