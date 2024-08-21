//package com.oleksii.leheza.projects.carmarket.service.interfaces;
//
//import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
//import com.oleksii.leheza.projects.carmarket.dto.create.CreateUserDto;
//import com.oleksii.leheza.projects.carmarket.entities.Client;
//
//import java.util.List;
//
//public interface ClientService {
//    Client save(CreateUserDto createUserDto);
//
//    Client save(Client client);
//
//    List<Client> findAll();
//
//    Client findById(Long clientId);
//
//    Client authorization(String email, String password);
//
//    void saveVehicleWithModerationStatus(VehicleDto vehicleDto, Long clientId);
//
//    void removeVehicleById(Long clientId, Long vehicleId);
//
//    VehicleDto getVehicleInfo(Long clientId, Long vehicleId);
//
//    void updateVehicle(VehicleDto vehicleDto, Long clientId, Long vehicleId);
//
//    List<VehicleDto> getVehiclesByClientId(Long clientId);
//
//    void disapproveVehicle(Long vehicleId);
//
//    List<VehicleDto> findAllPostedVehicles();
//
//    List<VehicleDto> filterVehicles(String carBrand, String carModel, String region, String year, String price, String gearbox ,String mileage, String usageStatus);
//
//    Client findByEmail(String email);
//}
