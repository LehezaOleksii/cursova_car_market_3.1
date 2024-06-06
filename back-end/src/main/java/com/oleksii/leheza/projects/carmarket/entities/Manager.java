package com.oleksii.leheza.projects.carmarket.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Manager extends User {


    @OneToMany(mappedBy = "client", cascade = CascadeType.REMOVE)
    @JsonManagedReference
    private List<Vehicle> vehicles;
    private String region;
    private UserRole userRole = UserRole.MANAGER;
}
