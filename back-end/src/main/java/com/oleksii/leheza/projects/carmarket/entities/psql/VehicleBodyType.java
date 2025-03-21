package com.oleksii.leheza.projects.carmarket.entities.psql;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vehicle_body_types")
public class VehicleBodyType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(mappedBy = "bodyType", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VehicleModel> vehicleModels = new HashSet<>();
    private String bodyTypeName;
    public VehicleBodyType(String bodyTypeName) {
        this.bodyTypeName = bodyTypeName;
    }
}
