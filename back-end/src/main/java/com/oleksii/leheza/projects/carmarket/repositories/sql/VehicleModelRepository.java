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

    @Query("SELECT vm FROM VehicleModel vm JOIN vm.engines e WHERE vm.modelName = :modelName AND e.name = :engineName")
    Optional<VehicleModel> findByModelNameAndEngineName(String modelName, String engineName);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM vehicle_models_engines WHERE vehicle_model_id = :modelId AND engines_id = :engineId", nativeQuery = true)
    void deleteEngineFromModel(@Param("modelId") Long modelId, @Param("engineId") Long engineId);

}
