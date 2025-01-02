package com.oleksii.leheza.projects.carmarket.entities.mongo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.oleksii.leheza.projects.carmarket.entities.psql.Photo;
import com.oleksii.leheza.projects.carmarket.entities.psql.VehicleBodyType;
import com.oleksii.leheza.projects.carmarket.enums.GearBox;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Year;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@Document(collection = "vehicle_histories")
public class VehicleHistory {

    public static Long globalVehicleHistoryId = 1L;

    @Id
    private String id;
    private Long historyId;
    private Year year;
    @Min(0)
    private int price;
    @Min(0)
    private int mileage;
    private GearBox gearBox;
    @ManyToOne
    @JsonBackReference
    @ToString.Exclude
    private Long userId;
    @ManyToOne(cascade = CascadeType.PERSIST)
    private VehicleBrandMongo brand;
    @Enumerated(EnumType.ORDINAL)
    private VehicleStatus status;
    @Enumerated(EnumType.ORDINAL)
    private UsageStatus usageStatus;
    private String region;
    private String phoneNumber;
    @Size(max = 250)
    private String description;
    @ManyToMany
    private List<Photo> photos;
    @ManyToOne
    @JoinColumn(name = "vehicle_model_id")
    private VehicleModelMongo vehicleModel;
    @ManyToOne
    @JoinColumn(name = "engine_id")
    private VehicleEngineMongo engine;
    @ManyToOne
    private VehicleBodyType bodyType;
    private int views;

    public VehicleHistory() {
        historyId = globalVehicleHistoryId++;
    }
}
