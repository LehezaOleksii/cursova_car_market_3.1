package com.oleksii.leheza.projects.carmarket.dto.view;

import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import lombok.*;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class VehicleGarageDto {

    private Long id;
    private Long userId;
    private String gearbox;
    private String engine;
    private int year;
    private int price;
    private long mileage;
    private String brandName;
    private String modelName;
    private VehicleStatus status;
    private String region;
    private String phoneNumber;
    private UsageStatus usageStatus;
    private String likes;
    private String views;
    private boolean isUserLiked;
    private byte[] photo;
}
