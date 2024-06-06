package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.entities.Admin;
import com.oleksii.leheza.projects.carmarket.entities.Client;
import com.oleksii.leheza.projects.carmarket.entities.Manager;
import com.oleksii.leheza.projects.carmarket.service.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/{adminId}/cabinet")
    public ResponseEntity<Admin> getAdminCabinet(@PathVariable Long adminId) {
        return new ResponseEntity<>(adminService.findById(adminId), HttpStatus.OK);
    }

    @PutMapping("/{adminId}/cabinet")
    public ResponseEntity<Admin> saveAdminInfo(@PathVariable Long adminId, @RequestBody Admin admin) {
        admin.setId(adminId);
        return new ResponseEntity<>(adminService.save(admin), HttpStatus.OK);
    }

    @GetMapping("/{adminId}/managers")
    public ResponseEntity<List<Manager>> getManagers() {
        return new ResponseEntity<>(adminService.getManagers(), HttpStatus.OK);
    }

    @GetMapping("/{adminId}/users/toapprove")
    public ResponseEntity<List<Client>> getUsersToApprove() {
        return new ResponseEntity<>(adminService.getUsersToApprove(), HttpStatus.OK);
    }

    @PutMapping("/{adminId}/users/{userId}/approve")
    public ResponseEntity<?> updateUserStatusToManager(@PathVariable Long userId) {
        adminService.approveManager(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{adminId}/managers/{managerId}")
    public ResponseEntity<Manager> getManagerInfo(@PathVariable Long managerId) {
        return new ResponseEntity<>(adminService.findManagerById(managerId), HttpStatus.OK);
    }

    @PutMapping("/{adminId}/managers/{managerId}")
    public ResponseEntity<?> updateManagerInfo(@PathVariable Long managerId, @RequestBody Manager manager) {
        manager.setId(managerId);
        return new ResponseEntity<>(adminService.saveManager(manager), HttpStatus.OK);
    }

    @DeleteMapping("/{adminId}/managers/{managerId}/delete")
    public ResponseEntity<?> blockManager(@PathVariable Long managerId) {
        adminService.blockManager(managerId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
