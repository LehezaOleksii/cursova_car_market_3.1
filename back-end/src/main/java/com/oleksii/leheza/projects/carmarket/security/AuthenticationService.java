package com.oleksii.leheza.projects.carmarket.security;

import com.oleksii.leheza.projects.carmarket.dto.security.AuthenticationRequest;
import com.oleksii.leheza.projects.carmarket.dto.security.AuthenticationResponse;
import com.oleksii.leheza.projects.carmarket.dto.security.RegisterRequest;
import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.exceptions.ResourceAlreadyExistsException;
import com.oleksii.leheza.projects.carmarket.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException("Email already taken");
        }
        User user = User.builder()
                .firstName(request.getFirstname())
                .lastName(request.getLastname())
                .email(request.getEmail())
                .password(request.getPassword())
                .userRole(UserRole.ROLE_CLIENT)
                .status(UserStatus.ACTIVE)
                .region(request.getRegion())
                .build();
        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .userId(user.getId())
                .jwt(jwtToken)
                .role(user.getUserRole().name())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getEmail(),
                        authenticationRequest.getPassword()
                )
        );
        User user = (User) authentication.getPrincipal();
        if (authentication.isAuthenticated()) {
            String jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                    .userId(user.getId())
                    .jwt(jwtToken)
                    .role(user.getUserRole().name())
                    .build();
        } else {
            throw new SecurityException("Authentication failed");
        }
    }
}
