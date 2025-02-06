package com.oleksii.leheza.projects.carmarket.repositories.sql;

import com.oleksii.leheza.projects.carmarket.entities.psql.UserVehicleLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserVehicleLikeRepository extends JpaRepository<UserVehicleLike, Long> {

    @Query("SELECT COUNT(uvl) FROM UserVehicleLike uvl WHERE uvl.vehicle.id = :vehicleId AND uvl.isLiked = TRUE")
    int getLikesByVehicleId(Long vehicleId);

    @Query("SELECT uvl FROM UserVehicleLike uvl WHERE uvl.vehicle.id = :vehicleId AND uvl.user.id = :userId")
    Optional<UserVehicleLike> findByUserIdAndVehicleId(Long userId, Long vehicleId);

    @Query("SELECT uvl.vehicle.id FROM UserVehicleLike uvl WHERE uvl.user.id = :userId AND uvl.isLiked = :isLiked")
    List<Long> findAllVehiclesIdsByUserIdAndLikedStatus(Long userId, Boolean isLiked);
}
