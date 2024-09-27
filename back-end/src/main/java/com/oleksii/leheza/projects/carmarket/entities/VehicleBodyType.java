package com.oleksii.leheza.projects.carmarket.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vehicle_body_types")
public class VehicleBodyType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bodyTypeName;

    public VehicleBodyType(String bodyTypeName) {
        this.bodyTypeName = bodyTypeName;
    }
}
