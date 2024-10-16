package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.Response;
import com.oleksii.leheza.projects.carmarket.dto.update.UserUpdateDto;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final UserService userService;

    @GetMapping("/cabinet")
    public ResponseEntity<UserUpdateDto> getUserData(@AuthenticationPrincipal String email) {
        Long id = userService.getUserIdByEmail(email);
        UserUpdateDto user = userService.getUserUpdateDtoById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/cabinet")
    public ResponseEntity<UserUpdateDto> saveUserInfo(@AuthenticationPrincipal String email,
                                                      @RequestBody UserUpdateDto userUpdateDto) {
        Long id = userService.getUserIdByEmail(email);
        userUpdateDto.setId(id);
        return new ResponseEntity<>(userService.update(userUpdateDto), HttpStatus.OK);
    }

    @GetMapping("/role")
    public ResponseEntity<Response> getUserRole(@AuthenticationPrincipal String email) {
        Response response = new Response(userService.getUserRoleByEmail(email));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
