package com.oleksii.leheza.projects.carmarket.repositories;

import com.oleksii.leheza.projects.carmarket.entities.UserVehicleLike;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserVehicleLikeRepository extends JpaRepository<UserVehicleLike, Long> {

    @Query("SELECT COUNT(uvl) FROM UserVehicleLike uvl WHERE uvl.vehicle.id = :vehicleId AND uvl.isLiked = TRUE")
    int getLikesByVehicleId(Long vehicleId);

    @Modifying
    @Transactional
    @Query("UPDATE UserVehicleLike uvl SET uvl.isLiked = :isLike WHERE uvl.user.id = :userId AND uvl.vehicle.id = :vehicleId")
    void setLike(Long userId, Long vehicleId, Boolean isLike);

    @Query("SELECT uvl FROM UserVehicleLike uvl WHERE uvl.vehicle.id = :vehicleId AND uvl.user.id = :userId")
    Optional<UserVehicleLike> findByUserIdAndVehicleId(Long userId, Long vehicleId);
    }
