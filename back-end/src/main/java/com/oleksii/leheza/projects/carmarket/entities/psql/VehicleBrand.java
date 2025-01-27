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
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "vehicle_brands")
public class VehicleBrand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min = 1, max = 255, message = "Brand name should be from 1 to 255 characters")
    private String brandName;
    @OneToMany(mappedBy = "vehicleBrand", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VehicleModel> vehicleModels = new HashSet<>();

    public VehicleBrand(String brandName) {
        this.brandName = brandName;
    }
}
