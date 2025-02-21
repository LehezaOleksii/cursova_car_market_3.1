package com.oleksii.leheza.projects.carmarket.dto.view;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserDetailsDto {

    private Long id;
    private String firstName;
    private String LastName;
    private String email;
    private byte[] profileImageUrl;
}
