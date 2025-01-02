package com.oleksii.leheza.projects.carmarket.entities.mongo;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class VehicleEngineMongo {

    private Long id;
    private String name;
    private float volume;
    private float horsepower;

    public VehicleEngineMongo(String name, float volume, float horsepower) {
        this.name = name;
        this.volume = volume;
        this.horsepower = horsepower;
    }
}
