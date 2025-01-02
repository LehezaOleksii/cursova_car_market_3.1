package com.oleksii.leheza.projects.carmarket.entities.mongo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class VehicleBrandMongo {

    private Long brandId;
    private String brandName;

    public VehicleBrandMongo(String brandName) {
        this.brandName = brandName;
    }
}