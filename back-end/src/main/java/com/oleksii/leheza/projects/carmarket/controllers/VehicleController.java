package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

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
}
