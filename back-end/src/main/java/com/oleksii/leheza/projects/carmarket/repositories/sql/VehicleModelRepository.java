package com.oleksii.leheza.projects.carmarket.repositories.sql;

import com.oleksii.leheza.projects.carmarket.entities.psql.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleModelRepository extends JpaRepository<VehicleModel, Long> {

    Optional<VehicleModel> findByModelName(String modelName);

    @Query("SELECT m FROM VehicleModel m JOIN m.vehicleBrand vb WHERE vb.brandName = :brandName")
    List<VehicleModel> findByBrandName(@Param("brandName") String brandName);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM vehicle_models_engines WHERE vehicle_model_id = :modelId AND engines_id = :engineId", nativeQuery = true)
    void unassignEngineFromModel(@Param("modelId") Long modelId, @Param("engineId") Long engineId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM vehicle_models_engines WHERE engines_id = :engineId AND vehicle_model_id IN (SELECT id FROM vehicle_models WHERE model_name IN (:modelNames))", nativeQuery = true)
    void unassignEngineFromModels(@Param("engineId") Long engineId, @Param("modelNames") List<String> modelNames);

    @Transactional
    @Modifying
    @Query("DELETE FROM Vehicle v WHERE v.engine.id = :engineId")
    void unassignEngineFromVehicles(Long engineId);
}
