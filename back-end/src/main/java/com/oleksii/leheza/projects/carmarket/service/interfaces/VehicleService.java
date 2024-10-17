package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.VehicleSearchCriteria;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;

import java.util.List;

public interface VehicleService {

    void deleteVehicleById(Long vehicleId);

    List<VehicleDto> getVehiclesByStatus(VehicleStatus status);

    void postVehicle(Long vehicleId);

    List<VehicleDto> findAllPostedVehicles();

    List<VehicleDto> filterVehicles(String carBrand, String carModel, String region, String year, String price, String gearbox, String mileage, String carState);

    void saveVehicleWithModerationStatus(VehicleDto vehicleDto, User user);

    VehicleDto getVehicleDtoById(Long vehicleId);

    void updateVehicle(Long userId, VehicleDto vehicleDto, Long vehicleId);

    List<VehicleDto> getVehiclesByUserIdAndVehicleStatus(Long userId, VehicleStatus status);

    void updateVehicleStatus(Long id, VehicleStatus status);

    List<String> getBodyTypeNames();

    List<String> getModelsByBrandName(String brandName);

    List<String> getVehicleBrandNames();

    List<String> getVehicleEngineNames(String vehicleModelName);

    Vehicle getVehicleById(Long vehicleId);

    List<VehicleDto> getVehiclesByUserEmail(String email);

    Page<Vehicle> getVehiclesWithFilter(int page, int size, VehicleSearchCriteria criterias);

    @Transactional
    void setLikeStatus(Long userId, Long vehicleId, Boolean isLiked);
}
