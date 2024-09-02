package com.oleksii.leheza.projects.carmarket.dto.mapper;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.create.CreateUserDto;
import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
import com.oleksii.leheza.projects.carmarket.entities.VehicleBrand;
import com.oleksii.leheza.projects.carmarket.entities.VehicleModel;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleBrandRepository;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleModelRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class DtoMapper {

    private VehicleBrandRepository vehicleBrandRepository;
    private VehicleModelRepository vehicleModelRepository;

    public Vehicle vehicleDtoToVehicle(VehicleDto vehicleDto) {
        VehicleBrand brand = new VehicleBrand(vehicleDto.getBrandName());
        vehicleBrandRepository.save(brand);
        VehicleModel model = new VehicleModel(vehicleDto.getModelName(), brand);
        vehicleModelRepository.save(model);
        return Vehicle.builder()
                .id(vehicleDto.getId())
                .model(model)
                .price(vehicleDto.getPrice())
                .mileage(vehicleDto.getMileage())
                .year(vehicleDto.getYear())
                .gearbox(vehicleDto.getGearbox())
                .region(vehicleDto.getRegion())
                .phoneNumber(vehicleDto.getPhoneNumber())
                .usageStatus(UsageStatus.valueOf(vehicleDto.getUsageStatus()))
                .photo(vehicleDto.getPhoto())
                .build();
    }

    public VehicleDto vehicleToVehicleDto(Vehicle vehicle) {
        VehicleModel model = vehicle.getModel();
        VehicleBrand brand = model.getBrand();
        return VehicleDto.builder()
                .id(vehicle.getId())
                .brandName(brand.getBrandName())
                .modelName(model.getModelName())
                .price(vehicle.getPrice())
                .mileage(vehicle.getMileage())
                .year(vehicle.getYear())
                .gearbox(vehicle.getGearbox())
                .region(vehicle.getRegion())
                .phoneNumber(vehicle.getPhoneNumber())
                .usageStatus(vehicle.getUsageStatus().toString())
                .photo(vehicle.getPhoto())
                .build();
    }

    public User createUserDtoToUser(CreateUserDto createUserDto) {
        return User.builder()
                .email(createUserDto.getEmail())
                .password(createUserDto.getPassword())
                .firstName(createUserDto.getFirstName())
                .lastName(createUserDto.getLastName())
                .build();
    }
}
