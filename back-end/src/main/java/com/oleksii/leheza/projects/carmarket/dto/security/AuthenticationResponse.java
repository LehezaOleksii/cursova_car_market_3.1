package com.oleksii.leheza.projects.carmarket.dto.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthenticationResponse {

    private final Long userId;
    private final String jwt;
    private final String role;
}