package com.oleksii.leheza.projects.carmarket.dto.view;

import lombok.*;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserManagerDashboardDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String status;
    private String userRole;
    private byte[] profileImageUrl;
}
