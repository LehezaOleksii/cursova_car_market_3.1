package com.oleksii.leheza.projects.carmarket.dto.update;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder(toBuilder = true)
public class BodyTypeDto {

    private long id;
    private String name;
}
