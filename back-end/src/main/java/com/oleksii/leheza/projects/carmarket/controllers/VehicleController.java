package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.entities.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.GearBox;
import com.oleksii.leheza.projects.carmarket.enums.VehicleApproveStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.repositories.UserVehicleLikeRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.EmailService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final EmailService emailService;
    private final UserService userService;
    private final UserVehicleLikeRepository userVehicleLikeRepository;

    @GetMapping("/brands/{brandName}/models")
    public ResponseEntity<List<String>> getModelNames(@PathVariable String brandName) {
        return new ResponseEntity<>(vehicleService.getModelsByBrandName(brandName), HttpStatus.OK);
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getVehicleBrandNames() {
        return new ResponseEntity<>(vehicleService.getVehicleBrandNames(), HttpStatus.OK);
    }

    @GetMapping("/body-types")
    public ResponseEntity<List<String>> getVehicleBodyTypeNames() {
        return new ResponseEntity<>(vehicleService.getBodyTypeNames(), HttpStatus.OK);
    }

    @GetMapping("/brands/models/{vehicleModelName}/engines")
    public ResponseEntity<List<String>> getVehicleEnginesNames(@PathVariable String vehicleModelName) {
        return new ResponseEntity<>(vehicleService.getVehicleEngineNames(vehicleModelName), HttpStatus.OK);
    }

    @GetMapping("/gearboxes")
    public ResponseEntity<List<GearBox>> getGearBoxes() {
        return new ResponseEntity<>(Arrays.asList(GearBox.values()), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT','ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/garage")
    public ResponseEntity<List<VehicleDto>> userVehicles(@AuthenticationPrincipal String email) {
        return new ResponseEntity<>(vehicleService.getVehiclesByUserEmail(email), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping
    public ResponseEntity<?> updateVehicle(@AuthenticationPrincipal String email,
                                           @RequestBody VehicleDto vehicleDto) {
        vehicleService.updateVehicle(userService.getUserIdByEmail(email), vehicleDto, vehicleDto.getId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleDto> getVehicle(@PathVariable Long vehicleId) {
        return new ResponseEntity<>(vehicleService.getVehicleDtoById(vehicleId), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/{vehicleId}/info")
    public ResponseEntity<VehicleDto> getVehicleInfo(@PathVariable Long vehicleId) {
        return new ResponseEntity<>(vehicleService.getVehicleDtoInfoById(vehicleId), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/{vehicleId}/approve")
    public ResponseEntity<?> approveVehicle(@PathVariable Long vehicleId) {
        vehicleService.updateVehicleStatus(vehicleId, VehicleStatus.POSTED);
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        emailService.sendVehicleApproveStatus(vehicle, vehicle.getUser().getEmail(), VehicleApproveStatus.APPROVED);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/{vehicleId}/disapprove")
    public ResponseEntity<?> disapproveVehicle(@PathVariable Long vehicleId) {
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        emailService.sendVehicleApproveStatus(vehicle, vehicle.getUser().getEmail(), VehicleApproveStatus.REJECTED);
        vehicleService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/to_approve")
    public ResponseEntity<List<VehicleDto>> getApproveVehicles() {
        return new ResponseEntity<>(vehicleService.getVehiclesByStatus(VehicleStatus.ON_MODERATION), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @DeleteMapping("{vehicleId}/remove")
    public ResponseEntity<?> removeVehicleByVehicleId(@PathVariable Long vehicleId) {
        vehicleService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<?> postVehicle(@AuthenticationPrincipal String email,
                                         @RequestBody VehicleDto vehicleDto) {
        User user = userService.findByEmail(email);
        vehicleService.saveVehicleWithModerationStatus(vehicleDto, user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("{vehicleId}")
    public ResponseEntity<?> changeVehicleById(@AuthenticationPrincipal String email,
                                               @PathVariable Long vehicleId,
                                               @RequestBody VehicleDto vehicleDto) {
        Long userId = userService.getUserIdByEmail(email);
        vehicleService.updateVehicle(userId, vehicleDto, vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<VehicleDto>> getAllPostedVehicles() {
        return new ResponseEntity<>(vehicleService.findAllPostedVehicles(), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @DeleteMapping("/{vehicleId}/delete")
    public ResponseEntity<?> deleteVehicleById(@PathVariable Long vehicleId) {
        vehicleService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/filter")
    public List<VehicleDto> filterVehicles(
            @RequestParam(required = false) String carBrand,
            @RequestParam(required = false) String carModel,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String price,
            @RequestParam(required = false) String gearbox,
            @RequestParam(required = false) String mileage,
            @RequestParam(required = false) String carState) {

        return vehicleService.filterVehicles(carBrand, carModel, region, year, price, gearbox, mileage, carState);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/{vehicleId}/like")
    public ResponseEntity<?> setLikeToVehicle(@AuthenticationPrincipal String email,
                                              @PathVariable Long vehicleId) {
        Long userId = userService.getUserIdByEmail(email);
        vehicleService.setLikeStatus(userId, vehicleId, true);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/{vehicleId}/no_like")
    public ResponseEntity<?> setNoLikeToVehicle(@AuthenticationPrincipal String email,
                                                @PathVariable Long vehicleId) {
        Long userId = userService.getUserIdByEmail(email);
        vehicleService.setLikeStatus(userId, vehicleId, false);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
