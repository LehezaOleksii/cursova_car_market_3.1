package com.oleksii.leheza.projects.carmarket.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class UserDto {

    @Column(length = 50)
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    private String firstName;
    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    private String lastName;
    @Email(message = "Please provide a valid email address")
    @Column(unique=true)
    private String email;
}
