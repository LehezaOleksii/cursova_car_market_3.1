package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.psql.VehicleBodyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleBodyTypeRepository extends JpaRepository<VehicleBodyType, Long> {

    Optional<VehicleBodyType> findByBodyTypeName(String bodyType);
}
