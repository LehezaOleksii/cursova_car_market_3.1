package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.create.CreateManagerDto;
import com.oleksii.leheza.projects.carmarket.entities.Client;
import com.oleksii.leheza.projects.carmarket.entities.Manager;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/managers")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping("/{managerId}/clients")
    public ResponseEntity<List<Client>> getClients() {
        return new ResponseEntity<>(managerService.getClients(), HttpStatus.OK);
    }

    @GetMapping("/{managerId}/vehicles")
    public ResponseEntity<List<VehicleDto>> getPostedVehicles() {
        return new ResponseEntity<>(managerService.getPostedVehicles(), HttpStatus.OK);
    }

    @GetMapping("/{managerId}/garage")
    public ResponseEntity<List<VehicleDto>> userVehicles(@PathVariable Long managerId) {
        return new ResponseEntity<>(managerService.getVehiclesByManagerId(managerId), HttpStatus.OK);
    }


    @DeleteMapping("/{managerId}/clients/{clientId}/block")
    public ResponseEntity<?> blockClientById(@PathVariable Long clientId) {
        managerService.blockClientById(clientId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{managerId}/vehicles/{vehicleId}/delete")
    public ResponseEntity<?> deleteVehicleById(@PathVariable Long vehicleId) {
        managerService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{managerId}/vehicles/{vehicleId}")
    public ResponseEntity<VehicleDto> getVehicleInfo(@PathVariable Long vehicleId){
        return new ResponseEntity<>(managerService.getVehicleInfo(vehicleId),HttpStatus.OK);
    }

    @PutMapping("/{managerId}/vehicles/{vehicleId}")
    public ResponseEntity<?> changeVehicleById(@PathVariable Long vehicleId, @RequestBody VehicleDto vehicleDto){
        managerService.updateVehicle(vehicleDto, vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping ("/{managerId}/cabinet")
    public ResponseEntity<Manager> getManagerCabinet(@PathVariable Long managerId){
        return new ResponseEntity<>(managerService.findById(managerId),HttpStatus.OK);
    }

    @PutMapping ("/{managerId}/cabinet")
    public ResponseEntity<Manager> saveManagerInfo(@PathVariable Long managerId, @RequestBody Manager manager){
        manager.setId(managerId);
        return new ResponseEntity<>(managerService.save(manager),HttpStatus.OK);
    }
    @GetMapping("/{managerId}/vehicles/to_approve")
    public ResponseEntity<List<VehicleDto>> getApproveVehicles() {
        return new ResponseEntity<>(managerService.getVehiclesToApprove(), HttpStatus.OK);
    }

    @PutMapping("/{managerId}/vehicles/{vehicleId}/approve")
    public ResponseEntity<?> approveVehicle(@PathVariable Long vehicleId){
        managerService.approveVehicle(vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{managerId}/vehicles/{vehicleId}/disapprove")
    public ResponseEntity<?> disapproveVehicle(@PathVariable Long vehicleId){
        managerService.disapproveVehicle(vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PostMapping("/{managerId}/vehicle")
    public ResponseEntity<?> postVehicle(@PathVariable Long managerId, @RequestBody VehicleDto vehicleDto) {
        managerService.saveVehicleWithModerationStatus(vehicleDto, managerId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{managerId}/vehicles/{vehicleId}/remove")
    public ResponseEntity<?> removeVehicleByVehicleId(@PathVariable Long managerId, @PathVariable Long vehicleId) {
        managerService.removeVehicleById(managerId, vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/{clientId}/vehicles/all")
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        return new ResponseEntity<>(managerService.findAllPostedVehicles(), HttpStatus.OK);
    }

    @GetMapping("/{clientId}/vehicles/filter")
    public List<VehicleDto> filterVehicles(
            @RequestParam(required = false) String carBrand,
            @RequestParam(required = false) String carModel,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String price,
            @RequestParam(required = false) String gearbox,
            @RequestParam(required = false) String mileage,
            @RequestParam(required = false) String carState) {
        return managerService.filterVehicles(carBrand, carModel, region, year, price, gearbox, mileage, carState);
    }
}
