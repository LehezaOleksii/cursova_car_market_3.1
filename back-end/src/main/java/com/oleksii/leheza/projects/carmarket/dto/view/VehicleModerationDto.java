package com.oleksii.leheza.projects.carmarket.dto.view;

import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import lombok.*;

@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class VehicleModerationDto {

    private Long id;
    private int year;
    private int price;
    private int mileage;
    private String brandName;
    private String modelName;
    private String region;
    private String phoneNumber;
    private UsageStatus usageStatus;
    private String status;
    private byte[] photo;
}
