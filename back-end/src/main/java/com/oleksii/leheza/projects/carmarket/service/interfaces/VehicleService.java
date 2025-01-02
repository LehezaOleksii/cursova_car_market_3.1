package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.create.CreateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.update.UpdateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleDashboardDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleGarageDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleModerationDto;
import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.entities.psql.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface VehicleService {

    void deleteVehicleById(Long vehicleId);

    List<VehicleModerationDto> getVehicleModerationDtosByStatus(VehicleStatus status);

    List<VehicleDashboardDto> findAllPostedVehicles();

    Page<VehicleDashboardDto> filterVehicles(Map<String, String> params, int page, int size);

    void saveVehicleWithModerationStatus(CreateVehicleDto vehicleDto, User user);

    UpdateVehicleDto getVehicleDtoInfoById(Long vehicleId);

    void updateVehicle(Long userId, UpdateVehicleDto vehicleDto, Long vehicleId);

    void updateVehicleStatus(Long id, VehicleStatus status);

    List<String> getBodyTypeNames();

    List<String> getModelsByBrandName(String brandName);

    List<String> getVehicleBrandNames();

    List<String> getVehicleEngineNames(String vehicleModelName);

    Vehicle getVehicleById(Long vehicleId);

    List<VehicleGarageDto> getVehiclesByUserEmail(String email);

    @Transactional
    void setLikeStatus(Long userId, Long vehicleId, Boolean isLiked);
}
