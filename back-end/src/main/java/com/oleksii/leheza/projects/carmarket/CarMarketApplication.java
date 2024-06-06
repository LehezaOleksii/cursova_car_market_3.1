package com.oleksii.leheza.projects.carmarket;

import com.oleksii.leheza.projects.carmarket.entities.Admin;
import com.oleksii.leheza.projects.carmarket.service.interfaces.AdminService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CarMarketApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarMarketApplication.class, args);
    }

    @Bean
    CommandLineRunner runner(AdminService adminService) {
        return args -> {
            String adminEmail = "admin@gmail.com";
            String adminPassword = "password";
            adminService.save(Admin.builder()
                    .id(1L)
                    .email(adminEmail)
                    .password(adminPassword)
                    .build());
        };
    }
}
