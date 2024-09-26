package com.oleksii.leheza.projects.carmarket.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@Table(name = "cities")
public class City {
    @Id
    @GeneratedValue
    private Long id;
    @Size(min = 1, max = 100)
    private String name;
    private String country;

    public City(String name, String country) {
        this.name = name;
        this.country = country;
    }
}
