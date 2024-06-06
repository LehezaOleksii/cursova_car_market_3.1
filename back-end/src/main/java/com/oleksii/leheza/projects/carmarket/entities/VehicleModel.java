package com.oleksii.leheza.projects.carmarket.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class VehicleModel {
    @Id
    @GeneratedValue
    private Long id;
    @Size(min = 3, max = 50, message = "Vehicle model should be from 3 to 50 characters")
    private String modelName;
    @OneToOne(cascade = CascadeType.PERSIST)
    private VehicleBrand brand;

    public VehicleModel(String modelName, VehicleBrand brand) {
        this.modelName = modelName;
        this.brand = brand;
    }
}
