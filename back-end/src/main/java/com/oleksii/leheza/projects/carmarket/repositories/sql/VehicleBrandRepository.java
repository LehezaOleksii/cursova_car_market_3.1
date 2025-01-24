package com.oleksii.leheza.projects.carmarket.repositories.sql;

import com.oleksii.leheza.projects.carmarket.entities.psql.VehicleBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface VehicleBrandRepository extends JpaRepository<VehicleBrand, Long> {

    Optional<VehicleBrand> findByBrandName(String brand);

    @Modifying
    @Transactional
    @Query("UPDATE VehicleBrand b SET b.brandName = :name WHERE b.id = :vehicleId")
    void updateBrandName(String name, Long vehicleId);
}
