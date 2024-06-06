package com.oleksii.leheza.projects.carmarket.dto;

import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
import com.oleksii.leheza.projects.carmarket.entities.VehicleBrand;
import com.oleksii.leheza.projects.carmarket.entities.VehicleModel;
import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Year;

@Getter
@Setter
@Builder(toBuilder = true)
public class VehicleDto {

    private Long id;
    private Year year;
    @Min(0)
    private int price;
    @Min(0)
    private int mileage;
    private String clientName;
    private String brandName;
    private String modelName;
    private String gearbox;
    private String status;
    private String region;
    private String phoneNumber;
    private String usageStatus;
    private byte[] photo;
}
