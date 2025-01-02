package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.psql.VehicleBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleBrandRepository extends JpaRepository<VehicleBrand, Long> {

    Optional<VehicleBrand> findByBrandName(String brand);
}
