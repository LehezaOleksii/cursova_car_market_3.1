package com.oleksii.leheza.projects.carmarket.entities.psql;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.oleksii.leheza.projects.carmarket.enums.GearBox;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.Year;
import java.util.List;

@Getter
@Setter
@Entity
@Builder(toBuilder = true)
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @ToString.Exclude
    private User user;
    @ManyToOne(cascade = CascadeType.PERSIST,fetch = FetchType.LAZY)
    private VehicleBrand brand;
    @Enumerated(EnumType.ORDINAL)
    private VehicleStatus status;
    @Enumerated(EnumType.ORDINAL)
    private UsageStatus usageStatus;
    private String region;
    private String phoneNumber;
    @Size(max = 1000)
    private String description;
    @ManyToMany
    private List<Photo> photos;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_model_id")
    private VehicleModel vehicleModel;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "engine_id")
    private Engine engine;
    @ManyToOne(fetch = FetchType.LAZY)
    private VehicleBodyType bodyType;
    private int views;
}
