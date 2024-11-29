package com.oleksii.leheza.projects.carmarket.security.filter.filters;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class VehicleSearchCriteria {

    private String usageStatus;
    private String brandName;
    private String modelName;
    private String gearbox;
    private String region;
    private String phoneNumber;
    private String bodyType;
    private String engine;
    private String fromYear;
    private String toYear;
    private String fromPrice;
    private String toPrice;
    private String fromMileage;
    private String toMileage;
}
