package com.oleksii.leheza.projects.carmarket.controllers;

import com.oleksii.leheza.projects.carmarket.dto.security.AuthenticationRequest;
import com.oleksii.leheza.projects.carmarket.dto.security.AuthenticationResponse;
import com.oleksii.leheza.projects.carmarket.dto.security.RegisterRequest;
import com.oleksii.leheza.projects.carmarket.security.AuthenticationService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.OtpService;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final OtpService otpService;
    private final UserService userService;

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest) {
        return ResponseEntity.ok(authenticationService.authenticate(authenticationRequest));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest) {
        return new ResponseEntity<>(authenticationService.register(registerRequest), HttpStatus.CREATED);
    }

    @GetMapping(path = "/confirm-email")
    public ResponseEntity<?> confirmEmail(@RequestParam String token) {
        userService.confirmEmail(token);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/forgot-password/send-otp")
    public ResponseEntity<?> forgotPasswordSendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (userService.existByEmail(email)) {
            otpService.sendOTP(email);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PostMapping(path = "/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String otp = request.get("otp");
        int otpInt = Integer.parseInt(otp);
        if (otpService.existByPassword(otpInt)) {
            otpService.deleteOtp(otpInt);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }


    @PostMapping(path = "/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        String email = request.get("email");
        userService.updateUserPasswordByEmail(email, newPassword);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (userService.existByEmail(email)) {
            otpService.sendOTP(email);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
