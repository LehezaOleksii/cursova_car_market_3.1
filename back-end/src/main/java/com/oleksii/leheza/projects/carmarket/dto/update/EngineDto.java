package com.oleksii.leheza.projects.carmarket.dto.update;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Builder(toBuilder = true)
public class EngineDto {

    private long id;
    private String name;
    private Set<String> modelNames;
    private float volume;
    private float horsepower;
}
