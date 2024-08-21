//package com.oleksii.leheza.projects.carmarket.security;
//
//import com.oleksii.leheza.projects.carmarket.enums.UserRole;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//import java.util.Collection;
//
//@Component
//@RequiredArgsConstructor
//public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
//
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
//                                        Authentication authentication) throws IOException {
//        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
//        String redirectUrl;
//        if (authorities.stream().anyMatch(authority -> authority.getAuthority().equals(UserRole.CLIENT.getAuthority()))) {
//            redirectUrl = "/clients/dashboard";
//        } else {
//            redirectUrl = "/managers/dashboard"; //TODO admin
//        }
//        response.sendRedirect(redirectUrl);
//    }
//}
