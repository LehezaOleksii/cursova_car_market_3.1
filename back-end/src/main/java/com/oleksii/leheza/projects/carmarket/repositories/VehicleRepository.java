package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Year;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v WHERE " +
            "(:brandName IS NULL OR v.model.brand.brandName = :brandName) AND " +
            "(:modelName IS NULL OR v.model.modelName = :modelName) AND " +
            "(:region IS NULL OR v.region = :region) AND " +
            "(:year IS NULL OR v.year = :year) AND " +
            "(:price IS NULL OR v.price = :price) AND " +
            "(:gearbox IS NULL OR v.gearbox = :gearbox) AND"+
            "(:mileage IS NULL OR v.mileage = :mileage)")
    List<Vehicle> findByClientFilter(@Param("brandName") String brandName,
                               @Param("modelName") String modelName,
                               @Param("region") String region,
                               @Param("year") Year year,
                               @Param("price") Integer price,
                               @Param("gearbox") String gearbox,
                                @Param("mileage") Integer mileage);
}
