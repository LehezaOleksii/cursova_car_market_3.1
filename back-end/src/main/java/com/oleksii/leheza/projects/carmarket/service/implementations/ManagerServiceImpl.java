//package com.oleksii.leheza.projects.carmarket.service.implementations;
//
//import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
//import com.oleksii.leheza.projects.carmarket.dto.create.CreateManagerDto;
//import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
//import com.oleksii.leheza.projects.carmarket.entities.Client;
//import com.oleksii.leheza.projects.carmarket.entities.Manager;
//import com.oleksii.leheza.projects.carmarket.entities.User;
//import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
//import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
//import com.oleksii.leheza.projects.carmarket.enums.UserRole;
//import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
//import com.oleksii.leheza.projects.carmarket.exceptions.ResourceAlreadyExistsException;
//import com.oleksii.leheza.projects.carmarket.repositories.ClientRepository;
//import com.oleksii.leheza.projects.carmarket.repositories.ManagerRepository;
//import com.oleksii.leheza.projects.carmarket.repositories.VehicleRepository;
//import com.oleksii.leheza.projects.carmarket.service.interfaces.ManagerService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.rest.webmvc.ResourceNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.time.Year;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class ManagerServiceImpl implements ManagerService {
//
//    private final ManagerRepository managerRepository;
//    private final ClientRepository clientRepository;
//    private final VehicleRepository vehicleRepository;
//    private final DtoMapper dtoMapper;
//
//    @Override
//    public Manager save(CreateManagerDto createManagerDto) {
//        String email = createManagerDto.getEmail();
//        Optional<Manager> clientOptional = managerRepository.findByEmail(email);
//        if (clientOptional.isEmpty()) {
//            return managerRepository.save(Manager.builder()
//                    .firstName(createManagerDto.getFirstName())
//                    .lastName(createManagerDto.getLastName())
//                    .email(email)
//                    .password(createManagerDto.getPassword())
//                    .userRole(UserRole.MANAGER)
//                    .build());
//        } else {
//            throw new ResourceAlreadyExistsException("Manager with email " + email + "already exists.");
//        }
//    }
//
//    @Override
//    public Manager save(Manager manager) {
//        return managerRepository.save(manager);
//    }
//
//    @Override
//    public List<Client> getClients() {
//        return clientRepository.findAll();
//    }
//
//    @Override
//    public void blockClientById(Long clientId) {
//        clientRepository.deleteById(clientId);
//    }
//
//    @Override
//    public void deleteVehicleById(Long vehicleId) {
//        vehicleRepository.deleteById(vehicleId);
//    }
//
//
//    @Override
//    public VehicleDto getVehicleInfo(Long vehicleId) {
//        return vehicleRepository.findById(vehicleId).map(dtoMapper::vehicleToVehicleDto)
//                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));
//    }
//
//    @Override
//    public void updateVehicle(VehicleDto vehicleDto, Long vehicleId) {
//        vehicleDto.setId(vehicleId);
//        Vehicle vehicle = dtoMapper.vehicleDtoToVehicle(vehicleDto);
//        User client = vehicleRepository.findById(vehicleId).get().getClient();
//        vehicle.setClient(client);
//        vehicle.setStatus(VehicleStatus.POSTED);
//        vehicleRepository.save(vehicle);
//    }
//
//    @Override
//    public Manager findById(Long managerId) {
//        Optional<Manager> optionalManager = managerRepository.findById(managerId);
//        if (optionalManager.isPresent()) {
//            return optionalManager.get();
//        }
//        throw new ResourceNotFoundException();
//    }
//
//    @Override
//    public void postVehicle(Long vehicleId) {
//        Vehicle vehicle = vehicleRepository.findById(vehicleId).get();
//        vehicle.setStatus(VehicleStatus.POSTED);
//    }
//
//    @Override
//    public List<VehicleDto> getPostedVehicles() {
//        return vehicleRepository.findAll().stream().filter(vehicle -> vehicle.getStatus() == VehicleStatus.POSTED)
//                .map(dtoMapper::vehicleToVehicleDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<VehicleDto> getVehiclesToApprove() {
//        return vehicleRepository.findAll().stream().filter(vehicle -> vehicle.getStatus() == VehicleStatus.ON_MODERATION)
//                .map(dtoMapper::vehicleToVehicleDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public void approveVehicle(Long vehicleId) {
//        Vehicle vehicle = vehicleRepository.findById(vehicleId).get();
//        vehicle.setStatus(VehicleStatus.POSTED);
//        vehicleRepository.save(vehicle);
//    }
//
//    @Override
//    public void disapproveVehicle(Long vehicleId) {
//        vehicleRepository.deleteById(vehicleId);
//    }
//
//    @Override
//    public List<VehicleDto> getVehiclesByManagerId(Long managerId) {
//        return managerRepository.findById(managerId).get().getVehicles().stream().filter(vehicle -> vehicle.getStatus() == VehicleStatus.POSTED)
//                .map(dtoMapper::vehicleToVehicleDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public void saveVehicleWithModerationStatus(VehicleDto vehicleDto, Long managerId) {
//        // TODO save client or car
//        Manager manager = managerRepository.findById(managerId).get();
//        Vehicle vehicle = dtoMapper.vehicleDtoToVehicle(vehicleDto);
//        vehicle.setClient(manager);
//        vehicle.setStatus(VehicleStatus.ON_MODERATION);
//        vehicleRepository.save(vehicle);
//        List<Vehicle> vehicles = manager.getVehicles();
//        if (!vehicles.contains(vehicle)) {
//            vehicles.add(vehicle);
//        }
//        managerRepository.save(manager);
//    }
//
//    @Override
//    public void removeVehicleById(Long clientId, Long vehicleId) {
//        vehicleRepository.deleteById(vehicleId);
//    }
//
//
//    @Override
//    public List<VehicleDto> findAllPostedVehicles() {
//        return vehicleRepository.findAll().stream()
//                .filter(vehicle -> vehicle.getStatus() == VehicleStatus.POSTED)
//                .map(dtoMapper::vehicleToVehicleDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<VehicleDto> filterVehicles(String carBrand, String carModel, String region, String stringYear, String stringPrice, String gearbox, String stringMileage, String stringUsageStatus) {
//        Year year = (stringYear != null && !stringYear.isEmpty()) ? Year.parse(stringYear) : null;
//        Integer price = (stringPrice != null && !stringPrice.isEmpty()) ? Integer.parseInt(stringPrice) : null;
//        Integer mileage = (stringMileage != null && !stringMileage.isEmpty()) ? Integer.parseInt(stringMileage) : null;
//        List<VehicleDto> vehicles = vehicleRepository.findByClientFilter(
//                        carBrand, carModel, region, year, price, gearbox, mileage).stream()
//                .map(dtoMapper::vehicleToVehicleDto)
//                .collect(Collectors.toList());
//        String defaultUsageStatus = "ALL";
//        UsageStatus usageStatus;
//        if (stringUsageStatus.equals(defaultUsageStatus)) {
//            usageStatus = null;
//        } else {
//            usageStatus = UsageStatus.valueOf(stringUsageStatus);
//        }
//        if (usageStatus == UsageStatus.NEW) {
//            vehicles = vehicles.stream().filter(vehicle -> UsageStatus.valueOf(vehicle.getUsageStatus()) == UsageStatus.NEW)
//                    .collect(Collectors.toList());
//        } else if (usageStatus == UsageStatus.USED) {
//            vehicles = vehicles.stream().filter(vehicle -> UsageStatus.valueOf(vehicle.getUsageStatus()) == UsageStatus.USED)
//                    .collect(Collectors.toList());
//        }
//        return vehicles;
//    }
//}
