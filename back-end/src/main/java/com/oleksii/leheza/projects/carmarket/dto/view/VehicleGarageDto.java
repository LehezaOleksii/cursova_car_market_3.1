package com.oleksii.leheza.projects.carmarket.dto.view;

import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder(toBuilder = true)
public class VehicleGarageDto {

    private Long id;
    private int year;
    private int price;
    private int mileage;
    private String brandName;
    private String modelName;
    private VehicleStatus status;
    private String region;
    private String phoneNumber;
    private UsageStatus usageStatus;
    private String likes;
    private String views;
    private boolean isUserLiked;
    private List<byte[]> photos;
}
