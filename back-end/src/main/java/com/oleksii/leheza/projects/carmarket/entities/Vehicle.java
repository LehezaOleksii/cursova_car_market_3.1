package com.oleksii.leheza.projects.carmarket.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.Year;


@Data
@Entity
@Builder (toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue
    private Long id;
    private Year year;
    @Min(0)
    private int price;
    @Min(0)
    private int mileage;
    private String gearbox;
    @ManyToOne
    @JsonBackReference
    @ToString.Exclude
    private User client;
    @OneToOne(cascade = CascadeType.PERSIST)
    private VehicleModel model;
    @Enumerated(EnumType.STRING)
    private VehicleStatus status;
    @Enumerated(EnumType.STRING)
    private UsageStatus usageStatus;
    private String region;
    private String phoneNumber;
    private byte[] photo;

    public void setModelName(String modelName) {
        model.setModelName(modelName);
    }

    public void setBrandName(String brandName) {
        model.getBrand().setBrandName(brandName);
    }
}
