package com.oleksii.leheza.projects.carmarket.dto.update;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder(toBuilder = true)
public class BodyTypeDto {

    private long id;
    @Size(min = 1, max = 255, message = "Body type should be from 1 to 255 characters")
    private String name;
}
