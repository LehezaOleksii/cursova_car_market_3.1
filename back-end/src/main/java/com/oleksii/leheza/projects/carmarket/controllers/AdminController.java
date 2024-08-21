package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/managers")
    public ResponseEntity<List<User>> getManagers() { //TODO filter
        return new ResponseEntity<>(userService.getUsersByRole(UserRole.ROLE_MANAGER), HttpStatus.OK);
    }

    @PutMapping("/users/{userId}/approve")
    public ResponseEntity<?> updateUserStatusToManager(@PathVariable Long userId) {
        userService.approveManager(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
