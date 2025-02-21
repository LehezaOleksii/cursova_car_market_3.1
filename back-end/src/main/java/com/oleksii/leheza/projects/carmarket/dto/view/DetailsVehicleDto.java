package com.oleksii.leheza.projects.carmarket.dto.view;

import com.oleksii.leheza.projects.carmarket.enums.GearBox;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class DetailsVehicleDto {

    private Long id;
    private int year;
    private int price;
    private int mileage;
    private String brandName;
    private String modelName;
    private GearBox gearbox;
    private String region;
    private String bodyType;
    private UsageStatus usageStatus;
    private String description;
    private String engine;
    private List<byte[]> photos;
    private int likes;
    private String views;
    private String phoneNumber;
    private boolean isUserLiked;
}
