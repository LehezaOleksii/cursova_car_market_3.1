package com.oleksii.leheza.projects.carmarket.entities;

import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "users")
public class User     {

    @Id
    @GeneratedValue
    private Long id;
    @Column(length = 50)
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    private String firstName;
    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    private String lastName;
    @Email(message = "Please provide a valid email address")
    @Column(unique = true)
    private String email;
    private String password;
    private byte[] profileImageUrl;
}