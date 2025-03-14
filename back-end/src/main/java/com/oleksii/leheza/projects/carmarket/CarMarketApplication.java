package com.oleksii.leheza.projects.carmarket;

import com.oleksii.leheza.projects.carmarket.entities.psql.City;
import com.oleksii.leheza.projects.carmarket.entities.psql.User;
import com.oleksii.leheza.projects.carmarket.enums.UserRole;
import com.oleksii.leheza.projects.carmarket.enums.UserStatus;
import com.oleksii.leheza.projects.carmarket.repositories.sql.CityRepository;
import com.oleksii.leheza.projects.carmarket.repositories.sql.UserRepository;
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

    private final UserRepository userRepository;
    private final CityRepository cityRepository;

    public CarMarketApplication(CityRepository cityRepository, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.cityRepository = cityRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(CarMarketApplication.class, args);
    }

    @Bean
    CommandLineRunner runner() {
        return args -> {
            if (userRepository.findAll().isEmpty()) {
                generateMainUsers();
            }
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

    private void generateMainUsers() {
        String password = "12345678_Password";
        String userEmail = "user@gmail.com";
        userRepository.save(User.builder()
                .email(userEmail)
                .firstName("Smith")
                .lastName("Johnson")
                .password(passwordEncoder().encode(password))
                .userRole(UserRole.ROLE_MANAGER)
                .status(UserStatus.ACTIVE)
                .build());
        String managerEmail = "manager@gmail.com";
        userRepository.save(User.builder()
                .email(managerEmail)
                .firstName("John")
                .lastName("Doe")
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
        String cityName = "Test City";
        cityRepository.save(new City(cityName));
    }
}
