package com.oleksii.leheza.projects.carmarket.initializer.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CityApiResponse {

    @JsonProperty("error")
    private boolean error;

    @JsonProperty("msg")
    private String msg;

    @JsonProperty("data")
    private List<String> data;
}