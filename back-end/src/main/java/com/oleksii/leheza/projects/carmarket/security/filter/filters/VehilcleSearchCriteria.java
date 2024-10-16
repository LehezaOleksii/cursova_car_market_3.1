package com.oleksii.leheza.projects.carmarket.security.filter.filters;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VehilcleSearchCriteria {

    private String fullName;
    private String email;
    private String status;
    private String role;
}
