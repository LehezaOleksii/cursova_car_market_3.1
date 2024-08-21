package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.update.UserUpdateDto;
import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final UserService userService;
    private final VehicleService vehicleService;

    @GetMapping("/cabinet/{id}")
    public ResponseEntity<UserUpdateDto> getUserData(@PathVariable Long id) {
        UserUpdateDto user = userService.getUserUpdateDtoById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/cabinet/{id}")
    public ResponseEntity<UserUpdateDto> saveUserInfo(@PathVariable Long id,
                                                      @RequestBody UserUpdateDto user) {
        user.setId(id);//TODO
        return new ResponseEntity<>(userService.update(user), HttpStatus.OK);
    }

    @PostMapping("/vehicle")
    public ResponseEntity<?> postVehicle(@AuthenticationPrincipal User user,
                                         @RequestBody VehicleDto vehicleDto) {
        vehicleService.saveVehicleWithModerationStatus(vehicleDto, user.getId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("{id}/garage")
    public ResponseEntity<List<VehicleDto>> userVehicles(@PathVariable Long id) {
        return new ResponseEntity<>(vehicleService.getVehiclesByUserId(id), HttpStatus.OK);
    }

    @DeleteMapping("{id}/vehicles/{vehicleId}/remove")
    public ResponseEntity<?> removeVehicleByVehicleId(@PathVariable Long id,
                                                      @PathVariable Long vehicleId) {
        vehicleService.removeVehicleById(id, vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/vehicles/{vehicleId}")
    public ResponseEntity<VehicleDto> getVehicleInfo(@PathVariable Long vehicleId) {
        return new ResponseEntity<>(vehicleService.getVehicleInfo(vehicleId), HttpStatus.OK);
    }

    @PutMapping("{id}/vehicles/{vehicleId}")
    public ResponseEntity<?> changeVehicleById(@PathVariable Long id,
                                               @PathVariable Long vehicleId,
                                               @RequestBody VehicleDto vehicleDto) {
        vehicleService.updateVehicle(id, vehicleDto, vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/vehicles/all")
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        return new ResponseEntity<>(vehicleService.findAllPostedVehicles(), HttpStatus.OK);
    }

    @DeleteMapping("/{managerId}/vehicles/{vehicleId}/delete")//TODO is present
    public ResponseEntity<?> deleteVehicleById(@PathVariable Long vehicleId) {
        vehicleService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/vehicles/filter")
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
}
