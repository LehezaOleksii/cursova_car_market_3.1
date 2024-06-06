package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.VehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.create.CreateClientDto;
import com.oleksii.leheza.projects.carmarket.entities.Client;
import com.oleksii.leheza.projects.carmarket.service.interfaces.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/{clientId}/cabinet")
    public ResponseEntity<Client> getClientCabinet(@PathVariable Long clientId) {
        return new ResponseEntity<>(clientService.findById(clientId), HttpStatus.OK);
    }

    @PutMapping("/{clientId}/cabinet")
    public ResponseEntity<Client> saveClientInfo(@PathVariable Long clientId, @RequestBody Client client) {
        client.setId(clientId);
        return new ResponseEntity<>(clientService.save(client), HttpStatus.OK);
    }

    @PostMapping("/{clientId}/vehicle")
    public ResponseEntity<?> postVehicle(@PathVariable Long clientId, @RequestBody VehicleDto vehicleDto) {
        clientService.saveVehicleWithModerationStatus(vehicleDto, clientId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{clientId}/garage")
    public ResponseEntity<List<VehicleDto>> userVehicles(@PathVariable Long clientId) {
        return new ResponseEntity<>(clientService.getVehiclesByClientId(clientId), HttpStatus.OK);
    }

    @DeleteMapping("/{clientId}/vehicles/{vehicleId}/remove")
    public ResponseEntity<?> removeVehicleByVehicleId(@PathVariable Long clientId, @PathVariable Long vehicleId) {
        clientService.removeVehicleById(clientId, vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{clientId}/vehicles/{vehicleId}")
    public ResponseEntity<VehicleDto> getVehicleInfo(@PathVariable Long clientId, @PathVariable Long vehicleId) {
        return new ResponseEntity<>(clientService.getVehicleInfo(clientId, vehicleId), HttpStatus.OK);
    }

    @PutMapping("/{clientId}/vehicles/{vehicleId}")
    public ResponseEntity<?> changeVehicleById(@PathVariable Long clientId, @PathVariable Long vehicleId, @RequestBody VehicleDto vehicleDto) {
        clientService.updateVehicle(vehicleDto, clientId, vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{managerId}/vehicles/{vehicleId}/block")
    public ResponseEntity<?> disapproveVehicle(@PathVariable Long vehicleId) {
        clientService.disapproveVehicle(vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{clientId}/vehicles/all")
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        return new ResponseEntity<>(clientService.findAllPostedVehicles(), HttpStatus.OK);
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
        return clientService.filterVehicles(carBrand, carModel, region, year, price, gearbox, mileage, carState);
    }
}
