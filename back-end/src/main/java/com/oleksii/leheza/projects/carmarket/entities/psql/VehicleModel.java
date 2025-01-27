package com.oleksii.leheza.projects.carmarket.entities.psql;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "vehicle_models")
public class VehicleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min = 1, max = 50, message = "Vehicle model should be from 1 to 50 characters")
    private String modelName;
    private int firstProductionYear;
    private int lastProductionYear;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "vehicle_body_type_id")
    private VehicleBodyType bodyType;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "vehicleModels")
    private Set<Engine> engines = new HashSet<>();
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "vehicle_brand_id")
    private VehicleBrand vehicleBrand;

    public VehicleModel(String modelName,
                        int firstProductionYear,
                        int lastProductionYear,
                        VehicleBodyType bodyType,
                        VehicleBrand vehicleBrand) {
        this.modelName = modelName;
        this.firstProductionYear = firstProductionYear;
        this.lastProductionYear = lastProductionYear;
        this.bodyType = bodyType;
        this.vehicleBrand = vehicleBrand;
    }

    public Engine addEngine(Engine engine) {
        engines.add(engine);
        return engine;
    }
}
