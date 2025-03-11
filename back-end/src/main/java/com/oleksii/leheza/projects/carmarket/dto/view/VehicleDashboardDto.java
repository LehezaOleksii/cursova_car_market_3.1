package com.oleksii.leheza.projects.carmarket.dto.view;

import lombok.*;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDashboardDto {

    private Long id;
    private Long userId;
    private int year;
    private int price;
    private long mileage;
    private String brandName;
    private String modelName;
    private String region;
    private String gearbox;
    private String engine;
    private int likes;
    private String views;
    private boolean isUserLiked;
    private byte[] photo;
}
