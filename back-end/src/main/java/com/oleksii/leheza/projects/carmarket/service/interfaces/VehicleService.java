package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.create.CreateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.update.*;
import com.oleksii.leheza.projects.carmarket.dto.view.DetailsVehicleDto;
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

    Page<VehicleDashboardDto> findAllPostedVehicles(int page, int size);

    Page<VehicleDashboardDto> filterVehicles(Map<String, String> params, VehicleStatus vehicleStatus, int page, int size);

    void saveVehicleWithModerationStatus(CreateVehicleDto vehicleDto, User user);

    DetailsVehicleDto getDetailsVehicleDtoById(Long vehicleId);

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

    Page<VehicleDashboardDto> getVehicleWithLikedStatus(Long userId, boolean isLiked, int page, int size);

    List<VehicleGarageDto> getVehiclesByUserId(Long userId);

    List<BrandDto> getVehicleBrandDtos();

    void updateVehicleBrandName(BrandDto brandDto);

    void deleteBrandById(Long brandId);

    List<ModelDto> getVehicleModelDtos();

    List<EngineDto> getEngines();

    void updateVehicleModel(ModelDto modelDto);

    void addEngineToModel(Long engineId, Long modelId);

    void unassignEngineToModel(Long engineId, Long modelId);

    void unassignEngineToVehicles(Long engineId);

    BrandDto createBrand(BrandDto brandDto);

    ModelDto createModel(ModelDto modelDto);

    void deleteModel(Long modelId);

    List<EngineDto> getVehicleEngineDtos();

    void updateVehicleEngine(EngineDto engineDto);

    List<BodyTypeDto> getVehicleBodyTypesDtos();

    BodyTypeDto createBodyType(BodyTypeDto bodyTypeDto);

    void updateVehicleBodyType(BodyTypeDto bodyTypeDto);

    void deleteBodyType(Long bodyTypeId);

    EngineDto createEngine(EngineDto engineDto);

    void deleteEngineById(Long engineId);

    Page<VehicleModerationDto> findAll(int page, int size);

    Page<VehicleGarageDto> filterVehiclesModeration(Map<String, String> params, int page, int size);

    UpdateVehicleDto getUpdateVehicleDtoById(Long vehicleId);

    Page<VehicleGarageDto> getVehicleGarageDtos(int page, int size);

    Page<VehicleGarageDto> getVehicleGarageDtosWithStatus(int page, int size, String status);

    void unassignEngineFromModels(Long engineId, List<String> modelNames);
}
