//package com.oleksii.leheza.projects.carmarket.service.implementations;
//
//import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
//import com.oleksii.leheza.projects.carmarket.dto.create.CreateUserDto;
//import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
//import com.oleksii.leheza.projects.carmarket.entities.Client;
//import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
//import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
//import com.oleksii.leheza.projects.carmarket.enums.UserRole;
//import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
//import com.oleksii.leheza.projects.carmarket.exceptions.AuthenticationException;
//import com.oleksii.leheza.projects.carmarket.exceptions.ResourceAlreadyExistsException;
//import com.oleksii.leheza.projects.carmarket.repositories.ClientRepository;
//import com.oleksii.leheza.projects.carmarket.repositories.VehicleRepository;
//import com.oleksii.leheza.projects.carmarket.service.interfaces.ClientService;
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
//public class ClientServiceImpl implements ClientService {
//
//    private final ClientRepository clientRepository;
//    private final VehicleRepository vehicleRepository;
//    private final DtoMapper dtoMapper;
//
//    @Override
//    public Client save(CreateUserDto createUserDto) {
//        String email = createUserDto.getEmail();
//        Optional<Client> clientOptional = clientRepository.findByEmail(email);
//        if (clientOptional.isEmpty()) {
//            return clientRepository.save(Client.builder()
//                    .firstName(createUserDto.getFirstName())
//                    .lastName(createUserDto.getLastName())
//                    .email(email)
//                    .region(createUserDto.getRegion())
//                    .password(createUserDto.getPassword())
//                    .userRole(UserRole.CLIENT)
//                    .build());
//        } else {
//            throw new ResourceAlreadyExistsException("Client with email " + email + "already exists.");
//        }
//    }
//
//    @Override
//    public Client save(Client client) {
//        return clientRepository.save(client);
//    }
//
//    @Override
//    public List<Client> findAll() {
//        return clientRepository.findAll();
//    }
//
//    @Override
//    public Client findById(Long clientId) {
//        Optional<Client> optionalClient = clientRepository.findById(clientId);
//        return optionalClient.orElseGet(Client::new);
//    }
//
//    @Override
//    public Client authorization(String email, String password) {
//        Optional<Client> clientOptional = clientRepository.findByEmail(email);
//        if (clientOptional.isPresent()) {
//            Client client = clientOptional.get();
//            if (client.getPassword().equals(password)) {
//                return client;
//            } else {
//                throw new AuthenticationException("Invalid password");
//            }
//        } else {
//            throw new ResourceNotFoundException("Client with email " + email + " not found");
//        }
//    }
//
//    @Override
//    public void saveVehicleWithModerationStatus(VehicleDto vehicleDto, Long clientId) {
//        // TODO save client or car
//        Client client = clientRepository.findById(clientId).get();
//        Vehicle vehicle = dtoMapper.vehicleDtoToVehicle(vehicleDto);
//        vehicle.setClient(client);
//        vehicle.setStatus(VehicleStatus.ON_MODERATION);
//        vehicleRepository.save(vehicle);
//        List<Vehicle> vehicles = client.getVehicles();
//        if (!vehicles.contains(vehicle)) {
//            vehicles.add(vehicle);
//        }
//        clientRepository.save(client);
//    }
//
//    @Override
//    public void updateVehicle(VehicleDto vehicleDto, Long clientId, Long vehicleId) {
//        vehicleDto.setId(vehicleId);
//
//        Client client = clientRepository.findById(clientId).get();
//        Vehicle vehicle = dtoMapper.vehicleDtoToVehicle(vehicleDto);
//        vehicle.setClient(client);
//        vehicle.setStatus(VehicleStatus.ON_MODERATION);
//        vehicleRepository.save(vehicle);
//    }
//
//    @Override
//    public List<VehicleDto> getVehiclesByClientId(Long clientId) {
//        return clientRepository.findById(clientId).get().getVehicles().stream().filter(vehicle -> vehicle.getStatus() == VehicleStatus.POSTED)
//                .map(dtoMapper::vehicleToVehicleDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public void disapproveVehicle(Long vehicleId) {
//        vehicleRepository.deleteById(vehicleId);
//    }
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
//    public void removeVehicleById(Long clientId, Long vehicleId) {
//        vehicleRepository.deleteById(vehicleId);
//    }
//
//    @Override
//    public VehicleDto getVehicleInfo(Long clientId, Long vehicleId) {
//        Client client = clientRepository.findById(clientId).get();
//        Vehicle vehicle = vehicleRepository.findById(vehicleId).get();
//        if (client.getVehicles().contains(vehicle)) {
//            return dtoMapper.vehicleToVehicleDto(vehicle);
//        }
//        throw new ResourceNotFoundException("Vehicle with " + vehicleId + " does not assign to the client");
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
//
//    @Override
//    public Client findByEmail(String email) {
//        return clientRepository.findByEmail(email).get();
//    }
//}
