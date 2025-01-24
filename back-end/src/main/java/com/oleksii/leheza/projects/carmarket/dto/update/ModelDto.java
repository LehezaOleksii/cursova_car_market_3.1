package com.oleksii.leheza.projects.carmarket.dto.update;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder(toBuilder = true)
public class ModelDto {

    private Long id;
    @Size(min = 1, max = 50, message = "Vehicle model should be from 1 to 50 characters")
    private String modelName;
    private int firstProductionYear;
    private int lastProductionYear;
    private String bodyTypeName;
    private List<EngineDto> engines;
    private String vehicleBrandName;
}
