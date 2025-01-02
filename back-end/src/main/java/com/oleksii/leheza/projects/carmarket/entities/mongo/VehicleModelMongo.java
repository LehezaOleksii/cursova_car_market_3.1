package com.oleksii.leheza.projects.carmarket.entities.mongo;

import com.oleksii.leheza.projects.carmarket.entities.psql.VehicleBodyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class VehicleModelMongo {

    private Long id;
    private String modelName;
    private int firstProductionYear;
    private int lastProductionYear;
    private VehicleBodyType bodyType;

    public VehicleModelMongo(String modelName,
                             int firstProductionYear,
                             int lastProductionYear,
                             VehicleBodyType bodyType) {
        this.modelName = modelName;
        this.firstProductionYear = firstProductionYear;
        this.lastProductionYear = lastProductionYear;
        this.bodyType = bodyType;
    }
}