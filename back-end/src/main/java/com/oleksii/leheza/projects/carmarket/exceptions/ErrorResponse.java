package com.oleksii.leheza.projects.carmarket.exceptions;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class ErrorResponse {

    private Integer code;
    private String error;
    private String message;
    private String path;
}