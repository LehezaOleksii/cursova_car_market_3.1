package com.oleksii.leheza.projects.carmarket.dto.update;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserUpdateDto {

    private Long id;
    private String firstname;
    private String lastname;
    private byte[] profileImageUrl;
}
