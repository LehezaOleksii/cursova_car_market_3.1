package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.Response;
import com.oleksii.leheza.projects.carmarket.dto.update.UserUpdateDto;
import com.oleksii.leheza.projects.carmarket.dto.view.UserDetailsDto;
import com.oleksii.leheza.projects.carmarket.dto.view.UserManagerDashboardDto;
import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.security.filter.filters.UserSearchCriteria;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
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

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get all users", description = "Get a list of all users.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UserManagerDashboardDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Users are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping()
    public ResponseEntity<Page<UserManagerDashboardDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<UserManagerDashboardDto> users = userService.findAllUsersManagerDashboardDto(page, size);
        return new ResponseEntity<>(users, users != null ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Change an existing client status", description = "Change an existing client status.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client status changed successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "User has not enough permissions to change this user status",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Client is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/{userId}/status/{userStatus}")
    public ResponseEntity<?> changeUserStatus(@PathVariable Long userId,
                                              @PathVariable UserStatus userStatus) {
        if (userService.isUserHasHigherRole(userId)) {
            userService.updateUserStatusByOtherUserById(userId, userStatus);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "Find all users by filter", description = "Get a list of users with use filter.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UserManagerDashboardDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "204", description = "Users are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_ADMIN')")
    @PostMapping("/filter")
    public ResponseEntity<Page<UserManagerDashboardDto>> filterUsers(@RequestParam(defaultValue = "0") int page,
                                                                     @RequestParam(defaultValue = "10") int size,
                                                                     @RequestBody UserSearchCriteria filterRequest) {
        Page<UserManagerDashboardDto> users = userService.getUsersWithFilter(page, size, filterRequest);
        return new ResponseEntity<>(users, !users.isEmpty() ? HttpStatus.OK : HttpStatus.NO_CONTENT);
    }


    @Operation(summary = "Get all managers", description = "Get a list of all managers.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Managers retrieved successfully",
                    content = @Content(schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @GetMapping("/managers")
    public ResponseEntity<List<User>> getManagers() {
        return new ResponseEntity<>(userService.getUsersByRole(UserRole.ROLE_MANAGER), HttpStatus.OK);
    }

    @Operation(summary = "Update an existing manager", description = "Update an existing manager.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Manager updated successfully",
                    content = @Content(schema = @Schema(implementation = Void.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Manager is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Manager duplicate",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @PutMapping("/users/{userId}/approve")
    public ResponseEntity<?> updateUserStatusToManager(@PathVariable Long userId) {
        userService.approveManager(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(summary = "Get user data", description = "Get user data by email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User data retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "User data are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/cabinet")
    public ResponseEntity<UserUpdateDto> getUserDataByEmail(@AuthenticationPrincipal String email) {
        Long id = userService.getUserIdByEmail(email);
        return new ResponseEntity<>(userService.getUserUpdateDtoById(id), HttpStatus.OK);
    }

    @Operation(summary = "Update an existing client", description = "Update an existing client.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client updated successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Client is not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Client duplicate",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @PutMapping("/cabinet")
    public ResponseEntity<?> saveUserInfo(@AuthenticationPrincipal String email,
                                          @Valid @RequestBody UserUpdateDto userUpdateDto) {
        Long id = userService.getUserIdByEmail(email);
        userUpdateDto.setId(id);
        userService.update(userUpdateDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Get user role", description = "Get user role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User role retrieved successfully",
                    content = @Content(schema = @Schema(implementation = Response.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "User role are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/role")
    public ResponseEntity<Response> getUserRole(@AuthenticationPrincipal String email) {
        Response response = new Response(userService.getUserRoleByEmail(email));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Get user id by vehicle id", description = "Get an user id by vehicle id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User id retrieved successfully",
                    content = @Content(schema = @Schema(implementation = Response.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "User role are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/id/vehicleId/{vehicleId}")
    public ResponseEntity<Response> getUserIdByVehicleId(@PathVariable Long vehicleId) {
        Response response = new Response(userService.getUserIdByVehicleId(vehicleId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Get user id by vehicle id", description = "Get an user id by vehicle id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User id retrieved successfully",
                    content = @Content(schema = @Schema(implementation = Response.class))),
            @ApiResponse(responseCode = "400", description = "Bad request",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "User role are not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
    })
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_MANAGER', 'ROLE_ADMIN')")
    @GetMapping("/info/vehicleId/{vehicleId}")
    public ResponseEntity<UserDetailsDto> getUserDataByVehicleId(@PathVariable Long vehicleId) {
        return new ResponseEntity<>(userService.getUserDetailsInfoByVehicleId(vehicleId), HttpStatus.OK);
    }
}
