package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.UserSearchCriteria;
import com.oleksii.leheza.projects.carmarket.service.interfaces.EmailService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    private final EmailService emailService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
    }

    @PutMapping("/clients/{userId}/block")
    public ResponseEntity<?> blockUserById(@PathVariable Long userId) {
        if (userService.updateUserStatusByOtherUserById(userId, UserStatus.BLOCKED)) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/clients/{userId}/unblock")
    public ResponseEntity<?> unblockUserById(@PathVariable Long userId) {
        if (userService.updateUserStatusByOtherUserById(userId, UserStatus.ACTIVE)) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{managerId}/vehicles/{vehicleId}/delete")
    public ResponseEntity<?> deleteVehicleById(@PathVariable Long vehicleId) {
        vehicleService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/vehicles/{vehicleId}/remove")
    public ResponseEntity<?> removeVehicleByVehicleId(@AuthenticationPrincipal String email,
                                                      @PathVariable Long vehicleId) {
        User user = userService.findByEmail(email);
        vehicleService.removeVehicleById(user.getId(), vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/clients/filter")
    public ResponseEntity<Page<User>> getUsersWithFilter(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false, defaultValue = "ALL") String role,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "15") int size) {
        UserSearchCriteria criteria = new UserSearchCriteria(name, email, status, role);
        return new ResponseEntity<>(userService.getUsersWithFilter(page, size, criteria), HttpStatus.OK);
    }
}
