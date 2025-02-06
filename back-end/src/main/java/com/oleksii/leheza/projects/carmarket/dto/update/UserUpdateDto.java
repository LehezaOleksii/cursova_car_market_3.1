package com.oleksii.leheza.projects.carmarket.dto.update;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserUpdateDto {

    private Long id;
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    private String firstname;
    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    private String lastname;
    private byte[] profileImageUrl;
}
