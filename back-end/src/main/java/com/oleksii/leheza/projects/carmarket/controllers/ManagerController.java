package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/managers")
@RequiredArgsConstructor
public class ManagerController {

    private final UserService userService;
    private final VehicleService vehicleService;

    @GetMapping("/{managerId}/clients")
    public ResponseEntity<List<User>> getClients() { //TODO filter
        return new ResponseEntity<>(userService.getUsersByRole(UserRole.ROLE_CLIENT), HttpStatus.OK);
    }

    @DeleteMapping("/clients/{userId}/block")
    public ResponseEntity<?> blockUserById(@PathVariable Long userId) {
        userService.updateUserStatusById(userId, UserStatus.BLOCKED);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{managerId}/vehicles/{vehicleId}/delete")
    public ResponseEntity<?> deleteVehicleById(@PathVariable Long vehicleId) {//TODO is reqired
        vehicleService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/vehicles/to_approve")
    public ResponseEntity<List<VehicleDto>> getApproveVehicles() {
        return new ResponseEntity<>(vehicleService.getVehiclesByStatus(VehicleStatus.ON_MODERATION), HttpStatus.OK);
    }

    @PutMapping("/vehicles/{vehicleId}/approve")
    public ResponseEntity<?> approveVehicle(@PathVariable Long vehicleId) {
        vehicleService.approveVehicle(vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/vehicles/{vehicleId}/disapprove")
    public ResponseEntity<?> disapproveVehicle(@PathVariable Long vehicleId) {
        vehicleService.disapproveVehicle(vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/vehicles/{vehicleId}/remove")
    public ResponseEntity<?> removeVehicleByVehicleId(@AuthenticationPrincipal User user, //TODO
                                                      @PathVariable Long vehicleId) {
        vehicleService.removeVehicleById(user.getId(), vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
