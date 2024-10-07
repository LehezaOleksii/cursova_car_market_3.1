package com.oleksii.leheza.projects.carmarket.dto.mapper;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.create.CreateUserDto;
import com.oleksii.leheza.projects.carmarket.entities.*;
import com.oleksii.leheza.projects.carmarket.enums.GearBox;
import com.oleksii.leheza.projects.carmarket.enums.UsageStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.EngineRepository;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleBodyTypeRepository;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleBrandRepository;
import com.oleksii.leheza.projects.carmarket.repositories.VehicleModelRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DtoMapper {

    private final VehicleBrandRepository vehicleBrandRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final VehicleBodyTypeRepository vehicleBodyTypeRepository;
    private final EngineRepository engineRepository;
    private final UserService userService;

    public Vehicle vehicleDtoToVehicle(VehicleDto vehicleDto, List<Photo> photos) {
        VehicleBrand brand = vehicleBrandRepository.findByBrandName(vehicleDto.getBrandName())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found : " + vehicleDto.getBrandName()));
        VehicleModel model = vehicleModelRepository.findByModelName(vehicleDto.getModelName())
                .orElseThrow(() -> new ResourceNotFoundException("Model not found : " + vehicleDto.getModelName()));
        Engine engine = engineRepository.findByName(vehicleDto.getEngine())
                .orElseThrow(() -> new ResourceNotFoundException("Engine not found : " + vehicleDto.getEngine()));
        Vehicle vehicle = new Vehicle();
        if (vehicleDto.getStatus() != null) {
            vehicle.setStatus(VehicleStatus.valueOf(vehicleDto.getStatus()));
        }
        VehicleBodyType bodyType = vehicleBodyTypeRepository.findByBodyTypeName(vehicleDto.getBodyType())
                .orElseThrow(() -> new ResourceNotFoundException("BodyType not found : " + vehicleDto.getBodyType()));

        if (vehicleDto.getUserId() != null) {
            User user = userService.findById(vehicleDto.getUserId());
            vehicle.setUser(user);
        }

        return vehicle.toBuilder()
                .id(vehicleDto.getId())
                .price(vehicleDto.getPrice())
                .mileage(vehicleDto.getMileage())
                .year(Year.of(vehicleDto.getYear()))
                .region(vehicleDto.getRegion())
                .phoneNumber(vehicleDto.getPhoneNumber())
                .usageStatus(UsageStatus.valueOf(vehicleDto.getUsageStatus()))
                .photos(photos)
                .gearBox(GearBox.valueOf(vehicleDto.getGearbox()))
                .vehicleModel(model)
                .brand(brand)
                .description(vehicleDto.getDescription())
                .engine(engine)
                .bodyType(bodyType)
                .build();
    }

    public VehicleDto vehicleToVehicleDto(Vehicle vehicle) {
        VehicleModel model = vehicle.getVehicleModel();
        VehicleBrand brand = model.getVehicleBrand();
        return VehicleDto.builder()
                .id(vehicle.getId())
                .userId(vehicle.getUser().getId())
                .brandName(brand.getBrandName())
                .modelName(model.getModelName())
                .price(vehicle.getPrice())
                .mileage(vehicle.getMileage())
                .year(vehicle.getYear().getValue())
                .gearbox(vehicle.getGearBox().toString())
                .region(vehicle.getRegion())
                .phoneNumber(vehicle.getPhoneNumber())
                .usageStatus(vehicle.getUsageStatus().toString())
                .status(vehicle.getStatus().toString())
                .photos(getBytePhotos(vehicle.getPhotos()))
                .description(vehicle.getDescription())
                .engine(vehicle.getEngine().getName())
                .bodyType(vehicle.getBodyType().getBodyTypeName())
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

    private List<byte[]> getBytePhotos(List<Photo> photos) {
        List<byte[]> bytePhotoList = new ArrayList<>();
        photos.forEach(photo -> {
            bytePhotoList.add(photo.getPhoto());
        });
        return bytePhotoList;
    }
}
