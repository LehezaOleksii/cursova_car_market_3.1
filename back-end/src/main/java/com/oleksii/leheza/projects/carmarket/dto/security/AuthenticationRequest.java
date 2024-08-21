package com.oleksii.leheza.projects.carmarket.dto.security;

import lombok.Data;

@Data
public class AuthenticationRequest {

    private String email;
    private String password;
}
