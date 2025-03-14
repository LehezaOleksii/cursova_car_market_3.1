package com.oleksii.leheza.projects.carmarket.repositories.sql;

import com.oleksii.leheza.projects.carmarket.entities.psql.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    Page<Vehicle> findAllByStatus(VehicleStatus status, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Vehicle v SET v.status = :status WHERE v.id = :vehicleId")
    void updateVehicleStatus(@Param("vehicleId") Long vehicleId, @Param("status") VehicleStatus status);

    @Query("SELECT v FROM Vehicle v WHERE v.user.email = :email")
    List<Vehicle> findAllByUserEmail(String email);

    @Query("SELECT COUNT(v) > 0 FROM Vehicle v WHERE v.id = :vehicleId AND v.user.id = :userId")
    boolean isUserHasVehicle(Long userId, Long vehicleId);

    @Query("SELECT v FROM Vehicle v WHERE v.id IN :vehicleIds AND v.status = :status")
    Page<Vehicle> findAllPostedVehiclesByIds(List<Long> vehicleIds,VehicleStatus status, Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.user.id = :userId")
    List<Vehicle> findByUserId(Long userId);

    @Query("SELECT COUNT (v) FROM Vehicle v where v.status=:vehicleStatus")
    long countByStatus(VehicleStatus vehicleStatus);

    @Query("""
    SELECT v FROM Vehicle v 
    ORDER BY CASE WHEN v.status = :status THEN 1 ELSE 2 END, v.status DESC
""")
    Page<Vehicle> findByStatusFirst(@Param("status") VehicleStatus status, Pageable pageable);

}
