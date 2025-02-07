package com.oleksii.leheza.projects.carmarket.dto.view;

import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import lombok.*;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDashboardDto {

    private Long id;
    private int year;
    private int price;
    private int mileage;
    private String brandName;
    private String modelName;
    private String region;
    private String phoneNumber;
    private UsageStatus usageStatus;
    private int likes;
    private String views;
    private boolean isUserLiked;
    private byte[] photo;
}
