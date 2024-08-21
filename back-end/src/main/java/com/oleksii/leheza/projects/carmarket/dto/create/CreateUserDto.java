package com.oleksii.leheza.projects.carmarket.dto.create;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String region;
}
