package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.Engine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EngineRepository extends JpaRepository<Engine, Long> {

    Optional<Engine> findByName(String name);

    @Query("SELECT e FROM VehicleModel vm JOIN vm.engines e WHERE vm.modelName = :vehicleModelName")
    List<Engine> findByVehicleModelName(String vehicleModelName);
}
