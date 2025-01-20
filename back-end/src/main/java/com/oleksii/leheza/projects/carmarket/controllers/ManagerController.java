package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/managers")
@RequiredArgsConstructor
public class ManagerController {

}
