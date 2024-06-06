package com.oleksii.leheza.projects.carmarket.entities;


import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;



@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Admin extends User{

    private UserRole userRole = UserRole.ADMIN;
}
