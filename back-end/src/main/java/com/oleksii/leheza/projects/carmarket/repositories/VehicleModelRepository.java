package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.psql.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleModelRepository extends JpaRepository<VehicleModel, Long> {

    Optional<VehicleModel> findByModelName(String modelName);

    @Query("SELECT m FROM VehicleModel m JOIN m.vehicleBrand vb WHERE vb.brandName = :brandName")
    List<VehicleModel> findByBrandName(@Param("brandName") String brandName);

    @Query("SELECT vm FROM VehicleModel vm JOIN vm.engines e WHERE vm.modelName = :modelName AND e.name = :engineName")
    Optional<VehicleModel> findByModelNameAndEngineName(String modelName, String engineName);
}
