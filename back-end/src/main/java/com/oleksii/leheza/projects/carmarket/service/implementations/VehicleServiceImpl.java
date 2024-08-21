package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DtoMapper dtoMapper;

    @Override
    public void deleteVehicleById(Long vehicleId) {
        vehicleRepository.deleteById(vehicleId);
    }

    @Override
    public List<VehicleDto> getVehiclesByStatus(VehicleStatus status) {
        return vehicleRepository.findAllByStatus(status)
                .stream()
                .map(dtoMapper::vehicleToVehicleDto)
                .toList();
    }

    @Override
    public void postVehicle(Long vehicleId) {
        vehicleRepository.updateVehicleStatus(vehicleId, VehicleStatus.POSTED);
    }

    @Override
    public List<VehicleDto> findAllPostedVehicles() {
        return vehicleRepository.findAllByStatus(VehicleStatus.POSTED)
                .stream()
                .map(dtoMapper::vehicleToVehicleDto)
                .toList();
    }

    @Override
    public List<VehicleDto> filterVehicles(String carBrand, String carModel, String region, String stringYear, String stringPrice, String gearbox, String stringMileage, String stringUsageStatus) {
        Year year = (stringYear != null && !stringYear.isEmpty()) ? Year.parse(stringYear) : null;
        Integer price = (stringPrice != null && !stringPrice.isEmpty()) ? Integer.parseInt(stringPrice) : null;
        Integer mileage = (stringMileage != null && !stringMileage.isEmpty()) ? Integer.parseInt(stringMileage) : null;
        List<VehicleDto> vehicles = vehicleRepository.findByClientFilter(
                        carBrand, carModel, region, year, price, gearbox, mileage).stream()
                .map(dtoMapper::vehicleToVehicleDto)
                .collect(Collectors.toList());
        String defaultUsageStatus = "ALL";
        UsageStatus usageStatus;
        if (stringUsageStatus.equals(defaultUsageStatus)) {
            usageStatus = null;
        } else {
            usageStatus = UsageStatus.valueOf(stringUsageStatus);
        }
        if (usageStatus == UsageStatus.NEW) {
            vehicles = vehicles.stream().filter(vehicle -> UsageStatus.valueOf(vehicle.getUsageStatus()) == UsageStatus.NEW)
                    .collect(Collectors.toList());
        } else if (usageStatus == UsageStatus.USED) {
            vehicles = vehicles.stream().filter(vehicle -> UsageStatus.valueOf(vehicle.getUsageStatus()) == UsageStatus.USED)
                    .collect(Collectors.toList());
        }
        return vehicles;
    }

    @Override
    public void saveVehicleWithModerationStatus(VehicleDto vehicleDto, Long userId) {
        Vehicle vehicle = dtoMapper.vehicleDtoToVehicle(vehicleDto);
        vehicle.setStatus(VehicleStatus.ON_MODERATION);
        vehicleRepository.save(vehicle);
    }

    @Override
    public void removeVehicleById(Long userId, Long vehicleId) {

    }

    @Override
    public VehicleDto getVehicleInfo(Long vehicleId) {
        return null;
    }

    @Override
    public void updateVehicle(Long userId,VehicleDto vehicleDto, Long vehicleId) {

    }

    @Override
    public List<VehicleDto> getVehiclesByUserId(Long userId) {
        return List.of();
    }

    @Override
    public void disapproveVehicle(Long vehicleId) {

    }

    @Override
    public void approveVehicle(Long vehicleId) {

    }
}
