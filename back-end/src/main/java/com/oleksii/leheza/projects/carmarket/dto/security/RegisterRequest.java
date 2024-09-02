package com.oleksii.leheza.projects.carmarket.dto.security;

import lombok.Data;

@Data
public class RegisterRequest {

    private String firstname;
    private String lastname;
    private String email;
    private String password;
}
