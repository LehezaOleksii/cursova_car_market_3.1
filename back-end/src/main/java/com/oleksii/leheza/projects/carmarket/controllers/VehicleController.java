package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.create.CreateVehicleDto;
import com.oleksii.leheza.projects.carmarket.dto.update.*;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleDashboardDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleGarageDto;
import com.oleksii.leheza.projects.carmarket.dto.view.VehicleModerationDto;
import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.entities.psql.Vehicle;
import com.oleksii.leheza.projects.carmarket.enums.GearBox;
import com.oleksii.leheza.projects.carmarket.enums.VehicleApproveStatus;
import com.oleksii.leheza.projects.carmarket.enums.VehicleStatus;
import com.oleksii.leheza.projects.carmarket.service.interfaces.EmailService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final EmailService emailService;
    private final UserService userService;

    @Operation(summary = "Get all model names by brand name", description = "Get a list of all vehicle model names by brand name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Model names retrieved successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "204", description = "Model names are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Brand name are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/brands/{brandName}/models")
    public ResponseEntity<List<String>> getModelNames(@PathVariable String brandName) {
        List<String> names = vehicleService.getModelsByBrandName(brandName);
        return new ResponseEntity<>(names, names != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all brands names", description = "Get a list of all vehicle brand names.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand names retrieved successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Brand names are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT','ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getVehicleBrandNames() {
        List<String> brands = vehicleService.getVehicleBrandNames();
        return new ResponseEntity<>(brands, brands != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Create a new brand", description = "Create a new brand with name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand created successfully",
                    content = @Content(schema = @Schema(implementation = BrandDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PostMapping("/brands")
    public ResponseEntity<BrandDto> createVehicleBrand(@Valid @RequestBody BrandDto brandDto) {
        return new ResponseEntity<>(vehicleService.createBrand(brandDto), HttpStatus.OK);
    }

    @Operation(summary = "Create a new model", description = "Create a new model.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Model created successfully",
                    content = @Content(schema = @Schema(implementation = ModelDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PostMapping("/models")
    public ResponseEntity<ModelDto> createVehicleModel(@Valid @RequestBody ModelDto modelDto) {
        return new ResponseEntity<>(vehicleService.createModel(modelDto), HttpStatus.OK);
    }

    @Operation(summary = "Create a new engine", description = "Create a new engine.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Engine created successfully",
                    content = @Content(schema = @Schema(implementation = EngineDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PostMapping("/engines")
    public ResponseEntity<EngineDto> createEngine(@RequestBody EngineDto engineDto) {
        return new ResponseEntity<>(vehicleService.createEngine(engineDto), HttpStatus.OK);
    }

    @Operation(summary = "Create a new body type", description = "Create a new body type.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Body type created successfully",
                    content = @Content(schema = @Schema(implementation = BodyTypeDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PostMapping("/body-types")
    public ResponseEntity<BodyTypeDto> createBodyType(@RequestBody BodyTypeDto bodyTypeDto) {
        return new ResponseEntity<>(vehicleService.createBodyType(bodyTypeDto), HttpStatus.OK);
    }

    @Operation(summary = "Get all brands dtos to change", description = "Get a list of all vehicle brand dtos to change.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand dtos retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BrandDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Brand dtos are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/brands/dtos")
    public ResponseEntity<List<BrandDto>> getVehicleBrandDtos() {
        List<BrandDto> brandsDtos = vehicleService.getVehicleBrandDtos();
        return new ResponseEntity<>(brandsDtos, brandsDtos != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all brands dtos to change", description = "Get a list of all vehicle brand dtos to change.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand dtos retrieved successfully",
                    content = @Content(schema = @Schema(implementation = EngineDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Brand dtos are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/engines/dtos")
    public ResponseEntity<List<EngineDto>> getVehicleEngineDtos() {
        List<EngineDto> engineDtos = vehicleService.getVehicleEngineDtos();
        return new ResponseEntity<>(engineDtos, engineDtos != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Update vehicle brand name", description = "Update vehicle brand name by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand names updated successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Brand names are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/brands")
    public ResponseEntity<?> changeVehicleBrand(@RequestBody BrandDto brandDto) {
        vehicleService.updateVehicleBrandName(brandDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Update vehicle body type", description = "Update body type by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Body type updated successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Body type is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/body-types")
    public ResponseEntity<?> changeBodyType(@RequestBody BodyTypeDto bodyTypeDto) {
        vehicleService.updateVehicleBodyType(bodyTypeDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Update vehicle models", description = "Update vehicle model")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Model updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Models are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/models")
    public ResponseEntity<?> updateVehicleModel(@RequestBody ModelDto modelDto) {
        vehicleService.updateVehicleModel(modelDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Update vehicle engine", description = "Update vehicle engine")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Engine updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Engine are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/engines")
    public ResponseEntity<?> updateVehicleEngine(@RequestBody EngineDto engineDto) {
        vehicleService.updateVehicleEngine(engineDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Add an engine to the model", description = "Add an engine to the model by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Engine added successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Engine is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/models/{modelId}/engines")
    public ResponseEntity<?> addEngineToModel(@PathVariable Long modelId,
                                              @RequestBody Long engineId) {
        vehicleService.addEngineToModel(engineId, modelId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Remove an engine to the model", description = "Remove an engine to the model by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Engine removed successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Engine is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @DeleteMapping("/models/{modelId}/engines/{engineId}")
    public ResponseEntity<?> deleteEngineForModel(@PathVariable Long modelId,
                                                  @PathVariable Long engineId) {
        vehicleService.deleteEngineToModel(engineId, modelId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Remove a model", description = "Remove a model by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Model removed successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Model is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @DeleteMapping("/models/{modelId}")
    public ResponseEntity<?> deleteModel(@PathVariable Long modelId) {
        vehicleService.deleteModel(modelId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Remove a body type", description = "Remove a body type by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Body type removed successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Body type is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @DeleteMapping("/body-types/{bodyTypeId}")
    public ResponseEntity<?> deleteBodyType(@PathVariable Long bodyTypeId) {
        vehicleService.deleteBodyType(bodyTypeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Delete vehicle brand", description = "Delete vehicle brand by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deleted brand successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Brand is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @DeleteMapping("/brands/{brandId}")
    public ResponseEntity<?> deleteVehicleBrandName(@PathVariable Long brandId) {
        vehicleService.deleteBrandById(brandId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Delete vehicle engine", description = "Delete vehicle engine by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deleted engine successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Engine is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @DeleteMapping("/engines/{engineId}")
    public ResponseEntity<?> deleteVehicleEngine(@PathVariable Long engineId) {
        vehicleService.deleteEngineById(engineId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all models dtos to change", description = "Get a list of all vehicle models dtos to change.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Models dtos retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ModelDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Models dtos are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/models/dtos")
    public ResponseEntity<List<ModelDto>> getVehicleModelsDtos() {
        List<ModelDto> modelDtos = vehicleService.getVehicleModelDtos();
        return new ResponseEntity<>(modelDtos, modelDtos != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all body types dtos to change", description = "Get a list of all body types dtos to change.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Body type dtos retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BodyTypeDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Body types are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/body-types/dtos")
    public ResponseEntity<List<BodyTypeDto>> getVehicleBodyTypesDtos() {
        List<BodyTypeDto> bodyTypes = vehicleService.getVehicleBodyTypesDtos();
        return new ResponseEntity<>(bodyTypes, bodyTypes != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all body types names", description = "Get a list of all vehicle body types names.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Body type names retrieved successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Body type names are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/body-types")
    public ResponseEntity<List<String>> getVehicleBodyTypeNames() {
        List<String> bodyTypes = vehicleService.getBodyTypeNames();
        return new ResponseEntity<>(bodyTypes, bodyTypes != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all body types names", description = "Get a list of all vehicle body types names.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Body type names retrieved successfully",
                    content = @Content(schema = @Schema(implementation = EngineDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Body type names are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/engines")
    public ResponseEntity<List<EngineDto>> getVehicleEngine() {
        List<EngineDto> engines = vehicleService.getEngines();
        return new ResponseEntity<>(engines, engines != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all engines names by vehicle model name", description = "Get a list of all engines names by vehicle model name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Engine names retrieved successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Engine names are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Vehicle model names are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/brands/models/{vehicleModelName}/engines")
    public ResponseEntity<List<String>> getVehicleEnginesNames(@PathVariable String vehicleModelName) {
        List<String> engines = vehicleService.getVehicleEngineNames(vehicleModelName);
        return new ResponseEntity<>(engines, engines != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all gear box names", description = "Get a list of all gear box names.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Gear box names retrieved successfully",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Gear box names are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @GetMapping("/gearboxes")
    public ResponseEntity<List<GearBox>> getGearBoxes() {
        return new ResponseEntity<>(Arrays.asList(GearBox.values()), HttpStatus.OK);
    }

    @Operation(summary = "Get all user vehicles", description = "Get a list of all user vehicles.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User vehicle retrieved successfully",
                    content = @Content(schema = @Schema(implementation = VehicleGarageDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "User vehicle are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Vehicles are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT','ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/garage")
    public ResponseEntity<List<VehicleGarageDto>> userVehicles(@AuthenticationPrincipal String email) {
        List<VehicleGarageDto> vehicles = vehicleService.getVehiclesByUserEmail(email);
        return new ResponseEntity<>(vehicles, vehicles != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get vehicle by vehicle id", description = "Get a user vehicle oby vehicle id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User vehicle retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UpdateVehicleDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "User vehicle are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/{vehicleId}/info")
    public ResponseEntity<UpdateVehicleDto> getVehicleInfo(@PathVariable Long vehicleId) {
        return new ResponseEntity<>(vehicleService.getVehicleDtoInfoById(vehicleId), HttpStatus.OK);
    }

    @Operation(summary = "Approve an existing vehicle", description = "Approve an existing vehicle.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle approved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/{vehicleId}/approve")
    public ResponseEntity<?> approveVehicle(@PathVariable Long vehicleId) {
        vehicleService.updateVehicleStatus(vehicleId, VehicleStatus.POSTED);
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        emailService.sendVehicleApproveStatus(vehicle, vehicle.getUser().getEmail(), VehicleApproveStatus.APPROVED);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Disapprove an existing vehicle", description = "Disapprove an existing vehicle.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle disapprove successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/{vehicleId}/disapprove")
    public ResponseEntity<?> disapproveVehicle(@PathVariable Long vehicleId) {
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        emailService.sendVehicleApproveStatus(vehicle, vehicle.getUser().getEmail(), VehicleApproveStatus.REJECTED);
        vehicleService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Get vehicles with moderation status", description = "Get a list of vehicles with moderation status.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User vehicle retrieved successfully",
                    content = @Content(schema = @Schema(implementation = VehicleModerationDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "User vehicle are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<VehicleModerationDto>> getVehicleModerationDtos(@RequestParam(defaultValue = "0") int page,
                                                                                       @RequestParam(defaultValue = "10") int size) {
        Page<VehicleModerationDto> vehicleDtos = vehicleService.findAll(page, size);
        return new ResponseEntity<>(vehicleDtos, vehicleDtos != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Delete a client by vehicle id", description = "Delete a client by its phone number.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Client deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Client is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<?> removeVehicleByVehicleId(@PathVariable Long vehicleId) {
        vehicleService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Create a new vehicle", description = "Create a new vehicle.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vehicle created successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<?> postVehicle(@AuthenticationPrincipal String email,
                                         @RequestBody CreateVehicleDto vehicleDto) {
        User user = userService.findByEmail(email);
        vehicleService.saveVehicleWithModerationStatus(vehicleDto, user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing vehicle", description = "Update an existing vehicle by id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Vehicle duplicate",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("{vehicleId}")
    public ResponseEntity<?> changeVehicleById(@AuthenticationPrincipal String email,
                                               @PathVariable Long vehicleId,
                                               @RequestBody UpdateVehicleDto vehicleDto) {
        Long userId = userService.getUserIdByEmail(email);
        vehicleService.updateVehicle(userId, vehicleDto, vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Get all posted vehicles", description = "Get all posted vehicles.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicles retrieved successfully",
                    content = @Content(schema = @Schema(implementation = VehicleDashboardDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Vehicles are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Vehicles are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/posted")
    public ResponseEntity<Page<VehicleDashboardDto>> getAllPostedVehicles(@RequestParam(defaultValue = "0") int page,
                                                                          @RequestParam(defaultValue = "10") int size) {
        Page<VehicleDashboardDto> vehicleDtos = vehicleService.findAllPostedVehicles(page, size);
        return new ResponseEntity<>(vehicleDtos, vehicleDtos != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Delete a client by vehicle id", description = "Delete a client by its phone number.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Client deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Client is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @DeleteMapping("/{vehicleId}/delete")
    public ResponseEntity<?> deleteVehicleById(@PathVariable Long vehicleId) {
        vehicleService.deleteVehicleById(vehicleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all posted vehicles with filter", description = "Get all posted vehicles with filter.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicles retrieved successfully",
                    content = @Content(schema = @Schema(implementation = VehicleDashboardDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Vehicles are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/filter")
    public ResponseEntity<Page<VehicleDashboardDto>> filterVehicles(@RequestParam Map<String, String> params,
                                                                    @RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "10") int size) {
        VehicleStatus vehicleStatus = VehicleStatus.valueOf(params.get("vehicleStatus"));
        return new ResponseEntity<>(vehicleService.filterVehicles(params, vehicleStatus, page, size), HttpStatus.OK);
    }

    @Operation(summary = "Get all posted vehicles with filter", description = "Get all posted vehicles with filter.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicles retrieved successfully",
                    content = @Content(schema = @Schema(implementation = VehicleDashboardDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Vehicles are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/management/filter")
    public ResponseEntity<Page<VehicleModerationDto>> filterVehiclesWithStatus(@RequestParam Map<String, String> params,
                                                                    @RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "10") int size) {
        return new ResponseEntity<>(vehicleService.filterVehiclesModeration(params, page, size), HttpStatus.OK);
    }

    @Operation(summary = "Update an existing vehicle likes", description = "Update an existing vehicle likes.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle likes updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/{vehicleId}/like/{isLike}")
    public ResponseEntity<?> setLikeToVehicle(@AuthenticationPrincipal String email,
                                              @PathVariable Boolean isLike,
                                              @PathVariable Long vehicleId) {
        Long userId = userService.getUserIdByEmail(email);
        vehicleService.setLikeStatus(userId, vehicleId, isLike);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Get all liked vehicles for user", description = "Get all liked vehicles for user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicles retrieved successfully",
                    content = @Content(schema = @Schema(implementation = VehicleDashboardDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Vehicles are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/liked/filter")
    public ResponseEntity<Page<VehicleDashboardDto>> getUserLikedCars(@AuthenticationPrincipal String email,
                                                                      @RequestParam Boolean isLiked,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size) {
        Long userId = userService.getUserIdByEmail(email);
        Page<VehicleDashboardDto> vehicleDtos = vehicleService.getVehicleWithLikedStatus(userId, isLiked, page, size);
        return new ResponseEntity<>(vehicleDtos, vehicleDtos != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all users cars by user id", description = "Get all users cars by user id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicles retrieved successfully",
                    content = @Content(schema = @Schema(implementation = VehicleDashboardDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Vehicles are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<VehicleDashboardDto>> getVehiclesByUserId (@PathVariable Long userId) {
        List<VehicleDashboardDto> vehicles = vehicleService.getVehiclesByUserId(userId);
        return new ResponseEntity<>(vehicles, vehicles != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }
}
