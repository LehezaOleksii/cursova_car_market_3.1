package com.oleksii.leheza.projects.carmarket.dto.security;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AuthenticationResponse {

    private final Long userId;
    private final String jwt;
    private final String role;
}