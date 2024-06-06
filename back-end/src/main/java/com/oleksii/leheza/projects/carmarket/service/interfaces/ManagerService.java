package com.oleksii.leheza.projects.carmarket.service.interfaces;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.create.CreateManagerDto;
import com.oleksii.leheza.projects.carmarket.entities.Client;
import com.oleksii.leheza.projects.carmarket.entities.Manager;

import java.util.List;

public interface ManagerService {
    Manager save(CreateManagerDto createManagerDto);

    Manager save (Manager manager);

    List<Client> getClients();

    void blockClientById(Long clientId);

    void deleteVehicleById(Long vehicleId);

    List<VehicleDto> getPostedVehicles();

    VehicleDto getVehicleInfo(Long vehicleId);

    void updateVehicle(VehicleDto vehicleDto, Long vehicleId);

    Manager findById(Long managerId);

    void postVehicle(Long vehicleId);

    List<VehicleDto> getVehiclesToApprove();

    void approveVehicle(Long vehicleId);

    void disapproveVehicle(Long vehicleId);

    List<VehicleDto> getVehiclesByManagerId(Long managerId);

    void saveVehicleWithModerationStatus(VehicleDto vehicleDto, Long managerId);

    void removeVehicleById(Long managerId, Long vehicleId);

    List<VehicleDto> findAllPostedVehicles();

    List<VehicleDto> filterVehicles(String carBrand, String carModel, String region, String year, String price, String gearbox, String mileage, String carState);
}
