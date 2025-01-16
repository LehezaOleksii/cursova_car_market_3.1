package com.oleksii.leheza.projects.carmarket.service.implementations;

import com.oleksii.leheza.projects.carmarket.dto.create.CreateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.mapper.DtoMapper;
import com.oleksii.leheza.projects.carmarket.dto.update.UpdateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleDashboardDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleGarageDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleModerationDto;
import com.oleksii.leheza.projects.carmarket.entities.psql.*;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
import com.oleksii.leheza.projects.carmarket.repositories.sql.*;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.VehicleSearchCriteria;
import com.oleksii.leheza.projects.carmarket.security.filter.specifications.VehicleSpecification;
import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
            VehicleDashboardDto vehicleDto = dtoMapper.vehicleToVehicleDashboardDto(vehicle);
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
        Page<Vehicle> vehiclesPage = vehicleSpecification.getVehiclesWithCriterias(criteria, vehicleStatus, page, size, sort);
        return vehiclesPage
                .map(vehicle -> {
                    VehicleDashboardDto vehicleDto = dtoMapper.vehicleToVehicleDashboardDto(vehicle);
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
    public UpdateVehicleDto getVehicleDtoInfoById(Long vehicleId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        UserRole role = UserRole.valueOf(userRepository.findRoleByEmail(userEmail));
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        if (vehicle.getStatus() != VehicleStatus.POSTED) {
            if (role.getOrder() <= UserRole.ROLE_MANAGER.getOrder()) {
                log.warn("User has not enough permissions");
                throw new com.oleksii.leheza.projects.carmarket.exceptions.SecurityException("User has not enough permissions");
            }
        }
        return dtoMapper.vehicleToUpdateVehicleDto(vehicle);
    }

    @Override
    public void updateVehicle(Long userId, UpdateVehicleDto vehicleDto, Long vehicleId) {
        if (vehicleRepository.isUserHasVehicle(userId, vehicleId)) {
            vehicleRepository.save(dtoMapper.updateVehicleDtoToVehicle(vehicleDto, getPhotosList(vehicleDto.getPhotos())));
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
        Page<Vehicle> vehicles = vehicleRepository.findAllPostedVehiclesByIds(vehicleIds, pageable);
        return vehicles.map(vehicle -> {
            VehicleDashboardDto dto = dtoMapper.vehicleToVehicleDashboardDto(vehicle);
            dto.setUserLiked(isLiked);
            return dto;
        });

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
