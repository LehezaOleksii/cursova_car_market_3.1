package com.oleksii.leheza.projects.carmarket.dto.update;

import com.oleksii.leheza.projects.carmarket.enums.GearBox;
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
public class UpdateVehicleDto {

    private Long id;
    private Long userId;
    private int year;
    @Min(0)
    private int price;
    @Min(0)
    private long mileage;
    @Size(min = 1, max = 255, message = "Brand name must be from 1 to 255 characters")
    private String brandName;
    @Size(min = 1, max = 50, message = "Vehicle model must be from 1 to 50 characters")
    private String modelName;
    private GearBox gearbox;
    private String region;
    private String phoneNumber;
    private String bodyType;
    private UsageStatus usageStatus;
    @Size(max = 250, message = "Description is too long. It must be less than 250 characters")
    private String description;
    private String engine;
    private List<byte[]> photos;
}
