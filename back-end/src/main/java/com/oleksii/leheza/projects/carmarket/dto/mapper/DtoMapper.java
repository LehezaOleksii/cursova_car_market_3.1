package com.oleksii.leheza.projects.carmarket.dto.mapper;

import com.oleksii.leheza.projects.carmarket.dto.create.CreateUserDto;
import com.oleksii.leheza.projects.carmarket.dto.create.CreateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.update.UpdateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleDashboardDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleGarageDto;
import com.oleksii.leheza.projects.carmarket.entities.*;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.*;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.VehicleSearchCriteria;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DtoMapper {

    private final VehicleBrandRepository vehicleBrandRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final VehicleBodyTypeRepository vehicleBodyTypeRepository;
    private final EngineRepository engineRepository;
    private final UserService userService;
    private final UserVehicleLikeRepository userVehicleLikeRepository;
    private final VehicleRepository vehicleRepository;

    public VehicleGarageDto vehicleToVehicleGarageDto(Vehicle vehicle) {
        VehicleModel model = vehicle.getVehicleModel();
        VehicleBrand brand = model.getVehicleBrand();
        int likes = userVehicleLikeRepository.getLikesByVehicleId(vehicle.getId());
        return VehicleGarageDto.builder()
                .id(vehicle.getId())
                .brandName(brand.getBrandName())
                .modelName(model.getModelName())
                .price(vehicle.getPrice())
                .mileage(vehicle.getMileage())
                .year(vehicle.getYear().getValue())
                .region(vehicle.getRegion())
                .phoneNumber(vehicle.getPhoneNumber())
                .usageStatus(vehicle.getUsageStatus())
                .status(vehicle.getStatus())
                .photos(getBytePhotos(vehicle.getPhotos()))
                .likes(String.valueOf(likes))
                .views(String.valueOf(vehicle.getViews()))
                .build();
    }

    public UpdateVehicleDto vehicleToUpdateVehicleDto(Vehicle vehicle) {
        return UpdateVehicleDto.builder()
                .id(vehicle.getId())
                .userId(vehicle.getUser().getId())
                .brandName(vehicle.getBrand().getBrandName())
                .modelName(vehicle.getVehicleModel().getModelName())
                .price(vehicle.getPrice())
                .mileage(vehicle.getMileage())
                .year(vehicle.getYear().getValue())
                .gearbox(vehicle.getGearBox())
                .region(vehicle.getRegion())
                .phoneNumber(vehicle.getPhoneNumber())
                .usageStatus(vehicle.getUsageStatus())
                .photos(getBytePhotos(vehicle.getPhotos()))
                .description(vehicle.getDescription())
                .engine(vehicle.getEngine().getName())
                .bodyType(vehicle.getBodyType().getBodyTypeName())
                .build();
    }

    public Vehicle createVehicleDtoToVehicle(CreateVehicleDto vehicleDto, List<Photo> photos) {
        VehicleBrand brand = vehicleBrandRepository.findByBrandName(vehicleDto.getBrandName())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found : " + vehicleDto.getBrandName()));
        VehicleModel model = vehicleModelRepository.findByModelName(vehicleDto.getModelName())
                .orElseThrow(() -> new ResourceNotFoundException("Model not found : " + vehicleDto.getModelName()));
        Engine engine = engineRepository.findByName(vehicleDto.getEngine())
                .orElseThrow(() -> new ResourceNotFoundException("Engine not found : " + vehicleDto.getEngine()));
        VehicleBodyType bodyType = vehicleBodyTypeRepository.findByBodyTypeName(vehicleDto.getBodyType().getBodyTypeName())
                .orElseThrow(() -> new ResourceNotFoundException("BodyType not found : " + vehicleDto.getBodyType()));
        return Vehicle.builder()
                .price(vehicleDto.getPrice())
                .mileage(vehicleDto.getMileage())
                .year(Year.of(vehicleDto.getYear()))
                .region(vehicleDto.getRegion())
                .phoneNumber(vehicleDto.getPhoneNumber())
                .usageStatus(vehicleDto.getUsageStatus())
                .photos(photos)
                .gearBox(vehicleDto.getGearbox())
                .vehicleModel(model)
                .brand(brand)
                .description(vehicleDto.getDescription())
                .engine(engine)
                .bodyType(bodyType)
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

    public VehicleSearchCriteria mapToVehicleSearchCriteria(Map<String, String> params) {
        VehicleSearchCriteria criteria = new VehicleSearchCriteria();
        return criteria.toBuilder()
                .fromMileage(params.get("fromMileage"))
                .toMileage(params.get("toMileage"))
                .fromYear(params.get("fromYear"))
                .toYear(params.get("toYear"))
                .fromPrice(params.get("fromPrice"))
                .toPrice(params.get("toPrice"))
                .gearbox(params.get("gearbox"))
                .modelName(params.get("modelName"))
                .usageStatus(params.get("usageStatus"))
                .engine(params.get("engine"))
                .brandName(params.get("brandName"))
                .bodyType(params.get("bodyType"))
                .region(params.get("region"))
                .phoneNumber(params.get("phoneNumber"))
                .build();
    }

    public Vehicle updateVehicleDtoToVehicle(UpdateVehicleDto vehicleDto, List<Photo> photosList) {
        VehicleBrand brand = vehicleBrandRepository.findByBrandName(vehicleDto.getBrandName())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found : " + vehicleDto.getBrandName()));
        VehicleModel model = vehicleModelRepository.findByModelName(vehicleDto.getModelName())
                .orElseThrow(() -> new ResourceNotFoundException("Model not found : " + vehicleDto.getModelName()));
        Engine engine = engineRepository.findByName(vehicleDto.getEngine())
                .orElseThrow(() -> new ResourceNotFoundException("Engine not found : " + vehicleDto.getEngine()));
        Vehicle vehicle;
        if (vehicleDto.getId() != null && vehicleDto.getId() > 0) {
            vehicle = vehicleRepository.findById(vehicleDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found : " + vehicleDto.getId()));
        } else {
            vehicle = new Vehicle();
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
                .usageStatus(vehicleDto.getUsageStatus())
                .photos(photosList)
                .gearBox(vehicleDto.getGearbox())
                .vehicleModel(model)
                .brand(brand)
                .description(vehicleDto.getDescription())
                .engine(engine)
                .bodyType(bodyType)
                .build();
    }

    public VehicleDashboardDto vehicleToVehicleDashboardDto(Vehicle vehicle) {
        VehicleModel model = vehicle.getVehicleModel();
        VehicleBrand brand = model.getVehicleBrand();
        int likes = userVehicleLikeRepository.getLikesByVehicleId(vehicle.getId());
        return VehicleDashboardDto.builder()
                .id(vehicle.getId())
                .brandName(brand.getBrandName())
                .modelName(model.getModelName())
                .price(vehicle.getPrice())
                .mileage(vehicle.getMileage())
                .year(vehicle.getYear().getValue())
                .region(vehicle.getRegion())
                .phoneNumber(vehicle.getPhoneNumber())
                .usageStatus(vehicle.getUsageStatus())
                .photos(getBytePhotos(vehicle.getPhotos()))
                .likes(likes)
                .views(String.valueOf(vehicle.getViews()))
                .build();
    }
}
