package com.oleksii.leheza.projects.carmarket.dto.mapper;

import com.oleksii.leheza.projects.carmarket.dto.chat.ChatHistory;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessageDto;
import com.oleksii.leheza.projects.carmarket.dto.chat.ChatSendMessageStatus;
import com.oleksii.leheza.projects.carmarket.dto.create.CreateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.update.*;
import com.oleksii.leheza.projects.carmarket.dto.view.UserManagerDashboardDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleDashboardDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleGarageDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleModerationDto;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatMessageMongo;
import com.oleksii.leheza.projects.carmarket.entities.mongo.ChatRoom;
import com.oleksii.leheza.projects.carmarket.entities.psql.*;
import com.oleksii.leheza.projects.carmarket.enums.ChatMessageType;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.sql.*;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.VehicleSearchCriteria;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class DtoMapper {

    private final VehicleBrandRepository vehicleBrandRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final VehicleBodyTypeRepository vehicleBodyTypeRepository;
    private final EngineRepository engineRepository;
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
                .gearBox(params.get("gearBox"))
                .modelName(params.get("modelName"))
                .usageStatus(params.get("usageStatus"))
                .engine(params.get("engine"))
                .brandName(params.get("brandName"))
                .bodyType(params.get("bodyType"))
                .region(params.get("region"))
                .status(params.get("status"))
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
        VehicleDashboardDto vehicleDashboardDto = new VehicleDashboardDto();
        List<byte[]> photos = getBytePhotos(vehicle.getPhotos());
        if (!photos.isEmpty()) {
            vehicleDashboardDto.setPhoto(photos.get(0));
        }
        return vehicleDashboardDto.toBuilder()
                .id(vehicle.getId())
                .brandName(brand.getBrandName())
                .modelName(model.getModelName())
                .price(vehicle.getPrice())
                .mileage(vehicle.getMileage())
                .year(vehicle.getYear().getValue())
                .region(vehicle.getRegion())
                .phoneNumber(vehicle.getPhoneNumber())
                .usageStatus(vehicle.getUsageStatus())
                .likes(likes)
                .views(String.valueOf(vehicle.getViews()))
                .build();
    }

    public VehicleModerationDto vehicleToVehicleModerationDto(Vehicle vehicle) {
        VehicleModerationDto vehicleModerationDto = new VehicleModerationDto();
        List<byte[]> photos = getBytePhotos(vehicle.getPhotos());
        if (!photos.isEmpty()) {
            vehicleModerationDto.setPhoto(photos.get(0));
        }
        return vehicleModerationDto.toBuilder()
                .id(vehicle.getId())
                .year(vehicle.getYear().getValue())
                .price(vehicle.getPrice())
                .brandName(vehicle.getBrand().getBrandName())
                .modelName(vehicle.getVehicleModel().getModelName())
                .mileage(vehicle.getMileage())
                .region(vehicle.getRegion())
                .phoneNumber(vehicle.getPhoneNumber())
                .usageStatus(vehicle.getUsageStatus())
                .status(vehicle.getStatus().name())
                .build();
    }

    public ChatHistory chatRoomToChatHistory(ChatRoom chatRoom) {
        return ChatHistory.builder()
                .firstMessages(chatRoom.getFirstUserMessages().stream()
                        .map(c -> chatMessageEntityToChatMessageDto(c, chatRoom.getFirstUserId()))
                        .toList())
                .secondMessages(chatRoom.getSecondUserMessages().stream()
                        .map(c -> chatMessageEntityToChatMessageDto(c, chatRoom.getSecondUserId()))
                        .toList())
                .build();
    }

    public com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessage chatMessageEntityToChatMessage(ChatMessageMongo chatMessageMongo, String recipientId) {
        com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessage chatMessageChat = new com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessage();
        chatMessageChat.setType(ChatMessageType.MESSAGE_FROM_USER);
        chatMessageChat.setMessage(ChatMessageDto.builder()
                .id(chatMessageMongo.getId())
                .recipientId(recipientId)
                .content(chatMessageMongo.getContent())
                .timestamp(String.valueOf(chatMessageMongo.getTimestamp()))
                .status(chatMessageMongo.getStatus())
                .build());
        return chatMessageChat;
    }

    public ChatMessageDto chatMessageEntityToChatMessageDto(ChatMessageMongo chatMessageMongo, String recipientId) {
        return ChatMessageDto.builder()
                .id(chatMessageMongo.getId())
                .recipientId(recipientId)
                .content(chatMessageMongo.getContent())
                .timestamp(String.valueOf(chatMessageMongo.getTimestamp()))
                .status(chatMessageMongo.getStatus())
                .build();
    }


    public UserManagerDashboardDto userToUserManagerDashboardDto(User user) {
        return UserManagerDashboardDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profileImageUrl(user.getProfileImageUrl())
                .status(String.valueOf(user.getStatus()))
                .userRole(user.getUserRole().name())
                .build();
    }

    public BrandDto brandToBrandDto(VehicleBrand vehicleBrand) {
        return BrandDto.builder()
                .name(vehicleBrand.getBrandName())
                .id(vehicleBrand.getId())
                .build();
    }

    public ModelDto modelToModelDto(VehicleModel vehicleModel) {
        return ModelDto.builder()
                .id(vehicleModel.getId())
                .modelName(vehicleModel.getModelName())
                .bodyTypeName(vehicleModel.getBodyType().getBodyTypeName())
                .engines(vehicleModel.getEngines().stream()
                        .map(this::engineToEngineDto)
                        .toList())
                .firstProductionYear(vehicleModel.getFirstProductionYear())
                .lastProductionYear(vehicleModel.getLastProductionYear())
                .vehicleBrandName(vehicleModel.getVehicleBrand().getBrandName())
                .build();
    }

    public EngineDto engineToEngineDto(Engine engine) {
        EngineDto engineDto = new EngineDto();
        if (engine != null && engine.getVehicleModels() != null) {
            engineDto.setModelNames(engine.getVehicleModels().stream()
                    .map(VehicleModel::getModelName)
                    .collect(Collectors.toSet()));
        } else {
            engineDto.setModelNames(new HashSet<>());
        }
        return engineDto.toBuilder()
                .id(engine.getId())
                .name(engine.getName())
                .volume(engine.getVolume())
                .horsepower(engine.getHorsepower())
                .build();
    }

    public BodyTypeDto bodyTypeToBodyTypeDto(VehicleBodyType vehicleBodyType) {
        return BodyTypeDto.builder()
                .id(vehicleBodyType.getId())
                .name(vehicleBodyType.getBodyTypeName())
                .build();
    }

    public Engine engineDtoToEngine(EngineDto engineDto) {
        return Engine.builder()
                .name(engineDto.getName())
                .horsepower(engineDto.getHorsepower())
                .volume(engineDto.getVolume())
                .build();
    }

    public com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessage chatMessageEntityToChatSendMessageStatus(ChatMessageMongo chatMessageMongo, String recipientId) {
        com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessage chatMessageChat = new com.oleksii.leheza.projects.carmarket.dto.chat.ChatMessage();
        chatMessageChat.setType(ChatMessageType.MESSAGE_FROM_USER);
        chatMessageChat.setMessage(ChatSendMessageStatus.builder()
                .messageId(chatMessageMongo.getContent())
                .recipientId(recipientId)
                .status(chatMessageMongo.getStatus().name())
                .build());
        return chatMessageChat;
    }
}
