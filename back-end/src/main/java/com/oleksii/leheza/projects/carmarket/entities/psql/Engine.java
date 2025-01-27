package com.oleksii.leheza.projects.carmarket.entities.psql;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@Table(name = "engines")
public class Engine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private float volume;
    private float horsepower;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "vehicle_models_engines",
            joinColumns = @JoinColumn(name = "engines_id"),
            inverseJoinColumns = @JoinColumn(name = "vehicle_model_id")
    )
    private Set<VehicleModel> vehicleModels = new HashSet<>();

    public Engine(String name, float volume, float horsepower) {
        this.name = name;
        this.volume = volume;
        this.horsepower = horsepower;
    }
}
