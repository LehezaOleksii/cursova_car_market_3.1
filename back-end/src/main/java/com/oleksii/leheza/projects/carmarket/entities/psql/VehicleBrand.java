package com.oleksii.leheza.projects.carmarket.entities.psql;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "vehicle_brands")
public class VehicleBrand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String brandName;
    @OneToMany(mappedBy = "vehicleBrand", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VehicleModel> vehicleModels = new HashSet<>();

    public VehicleBrand(String brandName) {
        this.brandName = brandName;
    }
}
