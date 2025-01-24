package com.oleksii.leheza.projects.carmarket.dto.update;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder(toBuilder = true)
public class BrandDto {

    private long id;
    @Size(min = 1, max = 255, message = "Brand name should be from 1 to 255 characters")
    private String name;
}
