package com.oleksii.leheza.projects.carmarket.dto.view;

import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder(toBuilder = true)
public class VehicleDashboardDto {

    private Long id;
    private int year;
    @Min(0)
    private int price;
    @Min(0)
    private int mileage;
    @Size(min = 1, max = 255, message = "Brand name must be from 1 to 255 characters")
    private String brandName;
    @Size(min = 1, max = 50, message = "Vehicle model must be from 1 to 50 characters")
    private String modelName;
    private String region;
    private String phoneNumber;
    private UsageStatus usageStatus;
    private int likes;
    private String views;
    private boolean isUserLiked;
    private List<byte[]> photos;
}
