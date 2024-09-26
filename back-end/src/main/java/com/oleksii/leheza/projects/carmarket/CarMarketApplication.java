package com.oleksii.leheza.projects.carmarket;

import com.oleksii.leheza.projects.carmarket.entities.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.repositories.UserRepository;
import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class CarMarketApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarMarketApplication.class, args);
    }

    @Bean
    CommandLineRunner runner(UserRepository userRepository) {
        return args -> {
            generateMainUsers(userRepository);
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserService userService) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    private void generateMainUsers(UserRepository userRepository) {
        String adminEmail = "admin@gmail.com";
        String password = "password";
        userRepository.save(User.builder()
                .email(adminEmail)
                .password(passwordEncoder().encode(password))
                .userRole(UserRole.ROLE_ADMIN)
                .status(UserStatus.ACTIVE)
                .build());
        String userEmail = "user@gmail.com";
        userRepository.save(User.builder()
                .email(userEmail)
                .password(passwordEncoder().encode(password))
                .userRole(UserRole.ROLE_ADMIN)
                .status(UserStatus.ACTIVE)
                .build());
        String managerEmail = "manager@gmail.com";
        userRepository.save(User.builder()
                .email(managerEmail)
                .password(passwordEncoder().encode(password))
                .userRole(UserRole.ROLE_MANAGER)
                .status(UserStatus.ACTIVE)
                .build());
        String clientEmail = "client@gmail.com";
        userRepository.save(User.builder()
                .email(clientEmail)
                .firstName("John")
                .lastName("Smith")
                .password(passwordEncoder().encode(password))
                .userRole(UserRole.ROLE_CLIENT)
                .status(UserStatus.ACTIVE)
                .build());
    }
}
