package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.entities.*;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.*;
import com.oleksii.leheza.projects.carmarket.service.interfaces.EmailService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleBodyTypeRepository vehicleBodyTypeRepository;
    private final VehicleBrandRepository vehicleBrandRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final EngineRepository engineRepository;
    private final PhotoRepository photoRepository;
    private final DtoMapper dtoMapper;
    private final EmailService emailService;

    @Override
    public void deleteVehicleById(Long vehicleId) {
        vehicleRepository.deleteById(vehicleId);
    }

    @Override
    public List<VehicleDto> getVehiclesByStatus(VehicleStatus status) {
        return vehicleRepository.findAllByStatus(status).stream()
                .map(dtoMapper::vehicleToVehicleDto)
                .toList();
    }

    @Override
    public void postVehicle(Long vehicleId) {
        vehicleRepository.updateVehicleStatus(vehicleId, VehicleStatus.POSTED);
    }

    @Override
    public List<VehicleDto> findAllPostedVehicles() {
        return vehicleRepository.findAllByStatus(VehicleStatus.POSTED).stream().map(dtoMapper::vehicleToVehicleDto).toList();
    }

    @Override
    public List<VehicleDto> filterVehicles(String carBrand, String carModel, String region, String stringYear, String stringPrice, String gearbox, String stringMileage, String stringUsageStatus) {
        Year year = (stringYear != null && !stringYear.isEmpty()) ? Year.parse(stringYear) : null;
        Integer price = (stringPrice != null && !stringPrice.isEmpty()) ? Integer.parseInt(stringPrice) : null;
        Integer mileage = (stringMileage != null && !stringMileage.isEmpty()) ? Integer.parseInt(stringMileage) : null;
        List<VehicleDto> vehicles = null; //TODO
        //        List<VehicleDto> vehicles = vehicleRepository.findByClientFilter(
//                        carBrand, carModel, region, year, price, gearbox, mileage).stream()
//                .map(dtoMapper::vehicleToVehicleDto)
//                .collect(Collectors.toList());
        String defaultUsageStatus = "ALL";
        UsageStatus usageStatus;
        if (stringUsageStatus.equals(defaultUsageStatus)) {
            usageStatus = null;
        } else {
            usageStatus = UsageStatus.valueOf(stringUsageStatus);
        }
        if (usageStatus == UsageStatus.NEW) {
            vehicles = vehicles.stream().filter(vehicle -> UsageStatus.valueOf(vehicle.getUsageStatus()) == UsageStatus.NEW).collect(Collectors.toList());
        } else if (usageStatus == UsageStatus.USED) {
            vehicles = vehicles.stream().filter(vehicle -> UsageStatus.valueOf(vehicle.getUsageStatus()) == UsageStatus.USED).collect(Collectors.toList());
        }
        return vehicles;
    }

    @Override
    public void saveVehicleWithModerationStatus(VehicleDto vehicleDto, User user) {
        List<Photo> photos = getPhotosList(vehicleDto.getPhotos());
        Vehicle vehicle = dtoMapper.vehicleDtoToVehicle(vehicleDto, photos);
        vehicle.setStatus(VehicleStatus.ON_MODERATION);
        vehicle.setUser(user);
        vehicleRepository.save(vehicle);
    }

    @Override
    public VehicleDto getVehicleDtoById(Long vehicleId) {
        return dtoMapper.vehicleToVehicleDto(vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found")));
    }

    @Override
    public void updateVehicle(Long userId, VehicleDto vehicleDto, Long vehicleId) {
        if (vehicleRepository.isUserHasVehicle(userId, vehicleId)) {
            vehicleRepository.save(dtoMapper.vehicleDtoToVehicle(vehicleDto, getPhotosList(vehicleDto.getPhotos())));
            System.out.println("UPPDATE:" + vehicleDto.getId());
            System.out.println("UPPDATE:" + vehicleRepository.findById(vehicleId).get().getBrand().getBrandName());
        } else {
            log.warn("User does not have vehicle: {}, user: {}", vehicleId, userId);
            throw new SecurityException("User does not have vehicle");
        }
    }

    @Override
    public List<VehicleDto> getVehiclesByUserIdAndVehicleStatus(Long userId, VehicleStatus status) {
        return vehicleRepository.findAllByUserIdAndVehicleStatus(userId, status).stream()
                .map(dtoMapper::vehicleToVehicleDto)
                .toList();
    }

    @Override
    public void updateVehicleStatus(Long id, VehicleStatus status) {
        vehicleRepository.updateVehicleStatus(id, status);
    }

    @Override
    public List<String> getBodyTypeNames() {
        return vehicleBodyTypeRepository.findAll().stream()
                .map(VehicleBodyType::getBodyTypeName)
                .toList();
    }

    @Override
    public List<String> getModelsByBrandName(String brandName) {
        return vehicleModelRepository.findByBrandName(brandName).stream()
                .map(VehicleModel::getModelName)
                .toList();
    }

    @Override
    public List<String> getVehicleBrandNames() {
        return vehicleBrandRepository.findAll().stream()
                .map(VehicleBrand::getBrandName)
                .toList();
    }

    @Override
    public List<String> getVehicleEngineNames(String vehicleModelName) {
        return engineRepository.findByVehicleModelName(vehicleModelName).stream()
                .map(Engine::getName)
                .toList();
    }

    @Override
    public Vehicle getVehicleById(Long vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle with id: " + vehicleId + " not found"));
    }

    @Override
    public List<VehicleDto> getVehiclesByUserEmail(String email) {
        return vehicleRepository.findAllByUserEmail(email).stream()
                .map(dtoMapper::vehicleToVehicleDto)
                .toList();
    }

    private List<Photo> getPhotosList(List<byte[]> photoBytes) {
        List<Photo> photos = new ArrayList<>();
        for (byte[] bytes : photoBytes) {
            Photo photo = new Photo(bytes);
            photoRepository.save(photo);
            photos.add(photo);
        }
        return photos;
    }
}
