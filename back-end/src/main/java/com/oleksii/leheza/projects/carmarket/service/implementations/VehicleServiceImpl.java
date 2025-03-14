package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.create.CreateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.dto.update.*;
import com.oleksii.leheza.projects.carmarket.dto.view.DetailsVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleDashboardDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleGarageDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleModerationDto;
import com.oleksii.leheza.projects.carmarket.entities.psql.*;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceAlreadyExistsException;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.sql.*;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.VehicleSearchCriteria;
import com.oleksii.leheza.projects.carmarket.security.filter.specifications.VehicleSpecification;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleServiceImpl implements VehicleService {

    private static final String SORT_PROPERTY_VIEWED = "views";

    private final VehicleRepository vehicleRepository;
    private final VehicleBodyTypeRepository vehicleBodyTypeRepository;
    private final VehicleBrandRepository vehicleBrandRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final EngineRepository engineRepository;
    private final PhotoRepository photoRepository;
    private final DtoMapper dtoMapper;
    private final VehicleSpecification vehicleSpecification;
    private final UserVehicleLikeRepository userVehicleLikeRepository;
    private final UserRepository userRepository;
    private final VehicleBrandRepository brandRepository;
    private final UserService userService;

    @Override
    public void deleteVehicleById(Long vehicleId) {
        vehicleRepository.deleteById(vehicleId);
    }

    @Override
    public Page<VehicleModerationDto> getVehicleModerationDtosByStatus(VehicleStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return vehicleRepository.findAllByStatus(status, pageable)
                .map(dtoMapper::vehicleToVehicleModerationDto);
    }

    @Override
    public Page<VehicleDashboardDto> findAllPostedVehicles(int page, int size) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userRepository.getUserIdByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Vehicle> vehiclesPage = vehicleRepository.findAllByStatus(VehicleStatus.POSTED, pageable);

        return vehiclesPage.map(vehicle -> {
            VehicleDashboardDto vehicleDto = dtoMapper.vehicleToVehicleDashboardDto(vehicle, userId);
            Optional<UserVehicleLike> userVehicleLike = userVehicleLikeRepository.findByUserIdAndVehicleId(userId, vehicle.getId());
            boolean isUserLiked = userVehicleLike.map(UserVehicleLike::isLiked).orElse(false);
            vehicleDto.setUserLiked(isUserLiked);
            return vehicleDto;
        });
    }


    @Override
    public Page<VehicleDashboardDto> filterVehicles(Map<String, String> params, VehicleStatus vehicleStatus, int page, int size) {
        Sort sort = Sort.by(SORT_PROPERTY_VIEWED);
        VehicleSearchCriteria criteria = dtoMapper.mapToVehicleSearchCriteria(params);
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userRepository.getUserIdByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        criteria.setStatus(vehicleStatus.name());
        Page<Vehicle> vehiclesPage = vehicleSpecification.getVehiclesWithCriterias(criteria, page, size, sort);
        return vehiclesPage
                .map(vehicle -> {
                    VehicleDashboardDto vehicleDto = dtoMapper.vehicleToVehicleDashboardDto(vehicle, userId);
                    Optional<UserVehicleLike> userVehicleLike = userVehicleLikeRepository.findByUserIdAndVehicleId(userId, vehicle.getId());
                    boolean isUserLiked = userVehicleLike.isPresent() && userVehicleLike.get().isLiked();
                    vehicleDto.setUserLiked(isUserLiked);
                    return vehicleDto;
                });
    }

    @Override
    public void saveVehicleWithModerationStatus(CreateVehicleDto vehicleDto, User user) {
        List<Photo> photos = getPhotosList(vehicleDto.getPhotos());
        Vehicle vehicle = dtoMapper.createVehicleDtoToVehicle(vehicleDto, photos);
        vehicle.setStatus(VehicleStatus.ON_MODERATION);
        vehicle.setUser(user);
        vehicleRepository.save(vehicle);
    }

    @Override
    public DetailsVehicleDto getDetailsVehicleDtoById(Long vehicleId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        UserRole role = UserRole.valueOf(userRepository.findRoleByEmail(userEmail));
        Long userId = userRepository.getUserIdByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + userEmail + " not found while retrieving details vehicle"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        if (vehicle.getStatus() != VehicleStatus.POSTED) {
            if (role.getOrder() > UserRole.ROLE_MANAGER.getOrder()) {
                log.warn("User has not enough permissions");
                throw new com.oleksii.leheza.projects.carmarket.exceptions.SecurityException("User has not enough permissions");
            }
        }
        DetailsVehicleDto detailsVehicleDto = dtoMapper.vehicleToDetailsVehicleDto(vehicle);
        Optional<UserVehicleLike> userVehicleLike = userVehicleLikeRepository.findByUserIdAndVehicleId(userId, vehicle.getId());
        boolean isUserLiked = false;
        if (userVehicleLike.isPresent()) {
            isUserLiked = userVehicleLike.get().isLiked();
        }
        detailsVehicleDto.setUserLiked(isUserLiked);
        vehicle.incrementViews();
        vehicleRepository.save(vehicle);
        return detailsVehicleDto;
    }

    @Override
    public void updateVehicle(Long userId, UpdateVehicleDto vehicleDto, Long vehicleId) {
        Long anotherUserId = Long.valueOf(userRepository.findUserIdByVehicleId(vehicleId));
        if (vehicleRepository.isUserHasVehicle(userId, vehicleId) || userService.isUserHasHigherRole(anotherUserId)) {
            if (vehicleDto.getId() != null) {
                Long ownerId = Long.valueOf(userService.getUserIdByVehicleId(vehicleId));
                vehicleDto.setUserId(ownerId);
                Vehicle vehicle = vehicleRepository.save(dtoMapper.updateVehicleDtoToVehicle(vehicleDto, getPhotosList(vehicleDto.getPhotos())));
                User user = userRepository.findById(ownerId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                vehicle.setUser(user);
            }
        } else {
            log.warn("User does not have vehicle: {}, user: {}", vehicleId, userId);
            throw new SecurityException("User does not have vehicle");
        }
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
        return engineRepository.findByVehicleModelName(vehicleModelName)
                .stream()
                .map(Engine::getName)
                .toList();
    }

    @Override
    public Vehicle getVehicleById(Long vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle with id: " + vehicleId + " not found"));
    }

    @Override
    public List<VehicleGarageDto> getVehiclesByUserEmail(String email) {
        Long userId = userRepository.getUserIdByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return vehicleRepository.findAllByUserEmail(email)
                .stream()
                .map(vehicle -> {
                    VehicleGarageDto vehicleDto = dtoMapper.vehicleToVehicleGarageDto(vehicle);
                    Optional<UserVehicleLike> userVehicleLike = userVehicleLikeRepository.findByUserIdAndVehicleId(userId, vehicle.getId());
                    boolean isUserLiked = false;
                    if (userVehicleLike.isPresent()) {
                        isUserLiked = userVehicleLike.get().isLiked();
                    }
                    vehicleDto.setUserLiked(isUserLiked);
                    return vehicleDto;
                })
                .toList();
    }

    @Override
    @Transactional
    public void setLikeStatus(Long userId, Long vehicleId, Boolean isLiked) {
        if (userVehicleLikeRepository.findByUserIdAndVehicleId(userId, vehicleId).isEmpty()) {
            UserVehicleLike userVehicleLike = createUserVehicleLike(userId, vehicleId);
            userVehicleLikeRepository.save(userVehicleLike);
        }
        UserVehicleLike userVehicleLike = userVehicleLikeRepository.findByUserIdAndVehicleId(userId, vehicleId).orElseThrow(() -> new ResourceNotFoundException("User vehicle like not found; user id = " + userId + "; vehicle id = " + vehicleId));
        userVehicleLike.setLiked(isLiked);
        userVehicleLikeRepository.save(userVehicleLike);
    }

    @Override
    public Page<VehicleDashboardDto> getVehicleWithLikedStatus(Long userId, boolean isLiked, int page, int size) {
        List<Long> vehicleIds = userVehicleLikeRepository.findAllVehiclesIdsByUserIdAndLikedStatus(userId, isLiked);
        Pageable pageable = PageRequest.of(page, size);
        Page<Vehicle> vehicles = vehicleRepository.findAllPostedVehiclesByIds(vehicleIds, VehicleStatus.POSTED, pageable);
        return vehicles.map(vehicle -> {
            VehicleDashboardDto dto = dtoMapper.vehicleToVehicleDashboardDto(vehicle, userId);
            Optional<UserVehicleLike> userVehicleLike = userVehicleLikeRepository.findByUserIdAndVehicleId(userId, vehicle.getId());
            boolean isUserLiked = false;
            if (userVehicleLike.isPresent()) {
                isUserLiked = userVehicleLike.get().isLiked();
            }
            dto.setUserLiked(isUserLiked);
            return dto;
        });
    }

    @Override
    public List<VehicleGarageDto> getVehiclesByUserId(Long userId) {
        return vehicleRepository.findByUserId(userId).stream()
                .map(dtoMapper::vehicleToVehicleGarageDto)
                .toList();
    }

    @Override
    public List<BrandDto> getVehicleBrandDtos() {
        return vehicleBrandRepository.findAll().stream()
                .map(dtoMapper::brandToBrandDto)
                .toList();
    }

    @Override
    public void updateVehicleBrandName(BrandDto brandDto) {
        vehicleBrandRepository.updateBrandName(brandDto.getName(), brandDto.getId());
    }

    @Override
    public void deleteBrandById(Long brandId) {
        vehicleBrandRepository.deleteById(brandId);
    }

    @Override
    public List<ModelDto> getVehicleModelDtos() {
        return vehicleModelRepository.findAll().stream()
                .map(dtoMapper::modelToModelDto)
                .toList();
    }

    @Override
    public List<EngineDto> getEngines() {
        return engineRepository.findAll().stream()
                .map(dtoMapper::engineToEngineDto)
                .toList();
    }

    @Override
    public void updateVehicleModel(ModelDto modelDto) {
        vehicleModelRepository.findById(modelDto.getId()).ifPresent(vehicleModel -> {
            VehicleModel vm = vehicleModel.toBuilder()
                    .id(modelDto.getId())
                    .modelName(modelDto.getModelName())
                    .firstProductionYear(modelDto.getFirstProductionYear())
                    .lastProductionYear(modelDto.getLastProductionYear())
                    .bodyType(vehicleBodyTypeRepository.findByBodyTypeName(modelDto.getBodyTypeName())
                            .orElseThrow(() -> new ResourceNotFoundException("Body type not found while model save")))
                    .vehicleBrand(brandRepository.findByBrandName(modelDto.getVehicleBrandName())
                            .orElseThrow(() -> new ResourceNotFoundException("Brand not found while model save")))
                    .build();
            vehicleModelRepository.save(vm);
        });
    }

    @Override
    public void addEngineToModel(Long engineId, Long modelId) {
        VehicleModel vehicleModel = vehicleModelRepository.findById(modelId)
                .orElseThrow(() -> new ResourceNotFoundException("Model not found with ID: " + modelId));
        Engine engine = engineRepository.findById(engineId)
                .orElseThrow(() -> new ResourceNotFoundException("Engine not found with ID: " + engineId));
        vehicleModel.addEngine(engine);
        vehicleModelRepository.save(vehicleModel);
    }

    @Override
    public void unassignEngineToModel(Long engineId, Long modelId) {
        vehicleModelRepository.unassignEngineFromModel(modelId, engineId);
    }

    @Override
    public void unassignEngineToVehicles(Long engineId) {
        vehicleModelRepository.unassignEngineFromVehicles(engineId);
    }

    @Override
    public BrandDto createBrand(BrandDto brandDto) {
        if (brandRepository.findByBrandName(brandDto.getName()).isEmpty()) {
            return dtoMapper.brandToBrandDto(brandRepository.save(new VehicleBrand(brandDto.getName())));
        } else {
            throw new ResourceAlreadyExistsException("Resource with name " + brandDto.getName() + " already exists");
        }
    }

    @Override
    public ModelDto createModel(ModelDto modelDto) {
        if (brandRepository.findByBrandName(modelDto.getModelName()).isEmpty()) {
            VehicleBodyType bodyType = vehicleBodyTypeRepository.findByBodyTypeName(modelDto.getBodyTypeName())
                    .orElseThrow(() -> new ResourceNotFoundException("Body type not found while model save"));
            VehicleBrand brand = vehicleBrandRepository.findByBrandName(modelDto.getVehicleBrandName())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found while model save"));
            return dtoMapper.modelToModelDto(vehicleModelRepository.save(new VehicleModel(
                    modelDto.getModelName(),
                    modelDto.getFirstProductionYear(),
                    modelDto.getLastProductionYear(),
                    bodyType,
                    brand)));
        } else {
            throw new ResourceAlreadyExistsException("Resource with name " + modelDto.getModelName() + " already exists");
        }
    }

    @Override
    public void deleteModel(Long modelId) {
        vehicleModelRepository.deleteById(modelId);
    }

    @Override
    public List<EngineDto> getVehicleEngineDtos() {
        return engineRepository.findAll().stream()
                .map(dtoMapper::engineToEngineDto)
                .toList();
    }

    @Override
    public void updateVehicleEngine(EngineDto engineDto) {
        engineRepository.findById(engineDto.getId()).ifPresent(engine -> {
            Engine e = engine.toBuilder()
                    .name(engineDto.getName())
                    .horsepower(engineDto.getHorsepower())
                    .volume(engineDto.getVolume())
                    .build();
            engineRepository.save(e);
        });
    }

    @Override
    public List<BodyTypeDto> getVehicleBodyTypesDtos() {
        return vehicleBodyTypeRepository.findAll().stream()
                .map(dtoMapper::bodyTypeToBodyTypeDto)
                .toList();
    }

    @Override
    public BodyTypeDto createBodyType(BodyTypeDto bodyTypeDto) {
        return dtoMapper.bodyTypeToBodyTypeDto(vehicleBodyTypeRepository.save(new VehicleBodyType(bodyTypeDto.getName())));
    }

    @Override
    public void updateVehicleBodyType(BodyTypeDto bodyTypeDto) {
        VehicleBodyType bodyType = vehicleBodyTypeRepository.findById(bodyTypeDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Body type not found with ID: " + bodyTypeDto.getId()));
        bodyType.setBodyTypeName(bodyTypeDto.getName());
        vehicleBodyTypeRepository.save(bodyType);
    }

    @Override
    public void deleteBodyType(Long bodyTypeId) {
        vehicleBodyTypeRepository.deleteById(bodyTypeId);
    }

    @Override
    public EngineDto createEngine(EngineDto engineDto) {
        Engine engine = dtoMapper.engineDtoToEngine(engineDto);
        return dtoMapper.engineToEngineDto(engineRepository.save(engine));
    }

    @Override
    public void deleteEngineById(Long engineId) {
        engineRepository.deleteById(engineId);
    }

    @Override
    public Page<VehicleModerationDto> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return vehicleRepository.findAll(pageable)
                .map(dtoMapper::vehicleToVehicleModerationDto);
    }

    @Override
    public Page<VehicleGarageDto> filterVehiclesModeration(Map<String, String> params, int page, int size) {
        Sort sort = Sort.by(SORT_PROPERTY_VIEWED);
        VehicleSearchCriteria criteria = dtoMapper.mapToVehicleSearchCriteria(params);
        Page<Vehicle> vehiclesPage = vehicleSpecification.getVehiclesWithCriterias(criteria, page, size, sort);
        return vehiclesPage
                .map(dtoMapper::vehicleToVehicleGarageDto);
    }

    @Override
    public UpdateVehicleDto getUpdateVehicleDtoById(Long vehicleId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userRepository.getUserIdByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + userEmail + " not found while retrieving details vehicle"));
        Long anotherUserId = Long.valueOf(userRepository.findUserIdByVehicleId(vehicleId));
        if (!userService.isUserHasHigherRole(anotherUserId)) {
            if (!vehicleRepository.isUserHasVehicle(userId, vehicleId)) {
                log.warn("User with id: " + userId + " has not permission to access vehicle with id: " + vehicleId);
                throw new com.oleksii.leheza.projects.carmarket.exceptions.SecurityException("User with id: " + userId + " has not permission to access vehicle with id: " + vehicleId);
            }
        }
        UserRole role = UserRole.valueOf(userRepository.findRoleByEmail(userEmail));
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        if (vehicle.getStatus() != VehicleStatus.POSTED) {
            if (role.getOrder() > UserRole.ROLE_MANAGER.getOrder()) {
                log.warn("User has not enough permissions");
                throw new com.oleksii.leheza.projects.carmarket.exceptions.SecurityException("User has not enough permissions");
            }
        }
        return dtoMapper.vehicleToUpdateVehicleDto(vehicle);
    }

    @Override
    public Page<VehicleGarageDto> getVehicleGarageDtos(int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Long userId = userRepository.getUserIdByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + userEmail + " not found"));
        Pageable pageable = PageRequest.of(page, size);
        Page<Vehicle> vehicles = vehicleRepository.findAll(pageable);
        return vehicles.map(vehicle -> {
            VehicleGarageDto vehicleDto = dtoMapper.vehicleToVehicleGarageDto(vehicle);
            Optional<UserVehicleLike> userVehicleLike = userVehicleLikeRepository.findByUserIdAndVehicleId(userId, vehicle.getId());
            boolean isUserLiked = userVehicleLike.map(UserVehicleLike::isLiked).orElse(false);
            vehicleDto.setUserLiked(isUserLiked);
            return vehicleDto;
        });
    }

    @Override
    public Page<VehicleGarageDto> getVehicleGarageDtosWithStatus(int page, int size, String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Long userId = userRepository.getUserIdByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + userEmail + " not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Vehicle> vehiclesPage = vehicleRepository.findByStatusFirst(VehicleStatus.ON_MODERATION, pageable);
        List<VehicleGarageDto> vehicleDtos = mapVehiclesToDtos(vehiclesPage, userId);
        return new PageImpl<>(vehicleDtos, pageable, vehiclesPage.getTotalElements());
    }

    @Override
    public void unassignEngineFromModels(Long engineId, List<String> modelNames) {
        vehicleModelRepository.unassignEngineFromModels(engineId,modelNames);
    }

    private List<VehicleGarageDto> mapVehiclesToDtos(Page<Vehicle> vehicles, Long userId) {
        List<VehicleGarageDto> vehicleDtos = new ArrayList<>();
        for (Vehicle vehicle : vehicles) {
            VehicleGarageDto vehicleDto = dtoMapper.vehicleToVehicleGarageDto(vehicle);
            Optional<UserVehicleLike> userVehicleLike = userVehicleLikeRepository.findByUserIdAndVehicleId(userId, vehicle.getId());
            boolean isUserLiked = userVehicleLike.map(UserVehicleLike::isLiked).orElse(false);
            vehicleDto.setUserLiked(isUserLiked);
            vehicleDtos.add(vehicleDto);
        }
        return vehicleDtos;
    }

    private UserVehicleLike createUserVehicleLike(Long userId, Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new RuntimeException("Vehicle with id: " + vehicleId + " not found while creating vehicle use like"));
        UserVehicleLike userVehicleLike = new UserVehicleLike();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User with id: " + userId + " not found while creating vehicle use like"));
        userVehicleLike.setUser(user);
        userVehicleLike.setVehicle(vehicle);
        return userVehicleLike;
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
