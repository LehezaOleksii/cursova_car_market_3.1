package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.security.AuthenticationRequest;
import com.oleksii.leheza.projects.carmarket.dto.security.AuthenticationResponse;
import com.oleksii.leheza.projects.carmarket.dto.security.RegisterRequest;
import com.oleksii.leheza.projects.carmarket.security.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest) {
        return ResponseEntity.ok(authenticationService.authenticate(authenticationRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest) {
        return new ResponseEntity<>(authenticationService.register(registerRequest), HttpStatus.CREATED);
    }

    @GetMapping("/csrf")
    public ResponseEntity<String> csrf(CsrfToken token) {
        System.out.println(token.getToken());
        return new ResponseEntity<>(token.getToken(), HttpStatus.OK);
    }
}
