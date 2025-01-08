package com.oleksii.leheza.projects.carmarket.security;

import com.oleksii.leheza.projects.carmarket.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final UserService userService;
    @Value("${spring.security.remember-me}")
    private String rememberMeKey;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .userDetailsService(userService)
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/clients/**").hasAnyRole("CLIENT", "MANAGER", "ADMIN")
                        .requestMatchers("/managers/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/admins/**").hasRole("ADMIN")
                        .requestMatchers("/chat/**").hasAnyRole("CLIENT", "MANAGER", "ADMIN")
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/swagger-ui/index.html").permitAll()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .rememberMe(remember -> remember
                        .rememberMeServices(rememberMeServices(userService))
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(new Http403ForbiddenEntryPoint()));
        return http.build();
    }

    @Bean
    RememberMeServices rememberMeServices(UserService userService) {
        TokenBasedRememberMeServices.RememberMeTokenAlgorithm encodingAlgorithm = TokenBasedRememberMeServices.RememberMeTokenAlgorithm.SHA256;
        TokenBasedRememberMeServices rememberMe = new TokenBasedRememberMeServices(rememberMeKey, userService, encodingAlgorithm);
        rememberMe.setMatchingAlgorithm(TokenBasedRememberMeServices.RememberMeTokenAlgorithm.MD5);
        return rememberMe;
    }
}
