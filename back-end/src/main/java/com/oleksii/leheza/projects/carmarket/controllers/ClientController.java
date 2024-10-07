package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.Response;
import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.update.UserUpdateDto;
import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceAlreadyExistsException;
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

    @GetMapping("/cabinet")
    public ResponseEntity<UserUpdateDto> getUserData(@AuthenticationPrincipal String email) {
        Long id = userService.getUserIdByEmail(email);
        UserUpdateDto user = userService.getUserUpdateDtoById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/cabinet")
    public ResponseEntity<UserUpdateDto> saveUserInfo(@AuthenticationPrincipal String email) {
        try {
            Long id = userService.getUserIdByEmail(email);
            UserUpdateDto user = userService.getUserUpdateDtoById(id);
            return new ResponseEntity<>(userService.update(user), HttpStatus.OK);
        } catch (ResourceAlreadyExistsException e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/vehicle")
    public ResponseEntity<?> postVehicle(@AuthenticationPrincipal String email,
                                         @RequestBody VehicleDto vehicleDto) {
        User user = userService.findByEmail(email);
        vehicleService.saveVehicleWithModerationStatus(vehicleDto, user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/vehicles/{vehicleId}")
    public ResponseEntity<VehicleDto> getVehicleInfo(@PathVariable Long vehicleId) {
        return new ResponseEntity<>(vehicleService.getVehicleDtoById(vehicleId), HttpStatus.OK);
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

    @GetMapping("/role")
    public ResponseEntity<Response> getUserRole(@AuthenticationPrincipal String email) {
        Response response = new Response(userService.getUserRoleByEmail(email));
        return new ResponseEntity<>(response, HttpStatus.OK);
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
