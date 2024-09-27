package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;

import java.util.List;

public interface VehicleService {

    void deleteVehicleById(Long vehicleId);

    List<VehicleDto> getVehiclesByStatus(VehicleStatus status);

    void postVehicle(Long vehicleId);

    List<VehicleDto> findAllPostedVehicles();

    List<VehicleDto> filterVehicles(String carBrand, String carModel, String region, String year, String price, String gearbox, String mileage, String carState);

    void saveVehicleWithModerationStatus(VehicleDto vehicleDto, Long userId);

    void removeVehicleById(Long userId, Long vehicleId);

    VehicleDto getVehicleInfo(Long vehicleId);

    void updateVehicle(Long userId, VehicleDto vehicleDto, Long vehicleId);

    List<VehicleDto> getVehiclesByUserId(Long userId);

    void disapproveVehicle(Long vehicleId);

    void approveVehicle(Long vehicleId);

    List<String> getBodyTypeNames();

    List<String> getModelsByBrandName(String brandName);

    List<String> getVehicleBrandNames();
}
