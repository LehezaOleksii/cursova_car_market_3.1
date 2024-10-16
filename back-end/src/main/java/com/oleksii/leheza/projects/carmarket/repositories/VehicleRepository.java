package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends
        JpaRepository<Vehicle, Long>,
        JpaSpecificationExecutor<Vehicle>,
        PagingAndSortingRepository<Vehicle, Long> {

//    @Query("SELECT v FROM Vehicle v WHERE " +
//            "(:brandName IS NULL OR v.model.brand.brandName = :brandName) AND " +
//            "(:modelName IS NULL OR v.model.modelName = :modelName) AND " +
//            "(:region IS NULL OR v.region = :region) AND " +
//            "(:year IS NULL OR v.year = :year) AND " +
//            "(:price IS NULL OR v.price = :price) AND " +
//            "(:gearbox IS NULL OR v.gearBox = :gearbox) AND"+
//            "(:mileage IS NULL OR v.mileage = :mileage)")
//    List<Vehicle> findByClientFilter(@Param("brandName") String brandName,
//                               @Param("modelName") String modelName,
//                               @Param("region") String region,
//                               @Param("year") Year year,
//                               @Param("price") Integer price,
//                               @Param("gearbox") String gearbox,
//                                @Param("mileage") Integer mileage);

    List<Vehicle> findAllByStatus(VehicleStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE Vehicle v SET v.status = :status WHERE v.id = :vehicleId")
    void updateVehicleStatus(@Param("vehicleId") Long vehicleId, @Param("status") VehicleStatus status);

    @Query("SELECT v FROM Vehicle v WHERE v.user.id = :userId AND v.status  = :status")
    List<Vehicle> findAllByUserIdAndVehicleStatus(Long userId, VehicleStatus status);

    @Query("SELECT v FROM Vehicle v WHERE v.user.email = :email")
    List<Vehicle> findAllByUserEmail(String email);

    @Query("SELECT COUNT(v) > 0 FROM Vehicle v WHERE v.id = :vehicleId AND v.user.id = :userId")
    boolean isUserHasVehicle(Long userId, Long vehicleId);
}
