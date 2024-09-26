package com.oleksii.leheza.projects.carmarket.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.oleksii.leheza.projects.carmarket.enums.GearBox;
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
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Year year;
    @Min(0)
    private int price;
    @Min(0)
    private int mileage;
    private GearBox gearBox;
    @ManyToOne
    @JsonBackReference
    @ToString.Exclude
    private User user;
    @ManyToOne(cascade = CascadeType.PERSIST)
    private VehicleBrand brand;
    @Enumerated(EnumType.ORDINAL)
    private VehicleStatus status;
    @Enumerated(EnumType.ORDINAL)
    private UsageStatus usageStatus;
    private String region;
    private String phoneNumber;
    private byte[] photo;
}
