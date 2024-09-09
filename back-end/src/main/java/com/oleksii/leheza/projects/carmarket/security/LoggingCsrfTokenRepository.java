//package com.oleksii.leheza.projects.carmarket.security;
//
//import com.oleksii.leheza.projects.carmarket.exceptions.ResourceNotFoundException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.web.csrf.CsrfToken;
//import org.springframework.security.web.csrf.CsrfTokenRepository;
//import org.springframework.security.web.csrf.DefaultCsrfToken;
//import org.springframework.stereotype.Component;
//
//import java.util.HashSet;
//import java.util.Set;
//import java.util.UUID;
//
//@Component
//public class LoggingCsrfTokenRepository implements CsrfTokenRepository {
//
//    static final String CSRF_PARAMETER_NAME = "_csrf";
//    static final String CSRF_HEADER_NAME = "X-XSRF-TOKEN";
//
//    private final Set<CsrfToken> tokenStore = new HashSet<>();
//
//    @Override
//    public CsrfToken generateToken(HttpServletRequest request) {
//        CsrfToken token = new DefaultCsrfToken(CSRF_HEADER_NAME, CSRF_PARAMETER_NAME, UUID.randomUUID().toString());
//        tokenStore.add(token);
//        return token;
//    }
//
//    @Override
//    public void saveToken(CsrfToken token, HttpServletRequest request, HttpServletResponse response) {
//        if (token != null) {
//            tokenStore.add(token);
//        } else {
//            throw new ResourceNotFoundException("token is null");
//        }
//    }
//
//    @Override
//    public CsrfToken loadToken(HttpServletRequest request) {
//        String headerCsrf = request.getHeader(CSRF_HEADER_NAME);
//        if (headerCsrf != null && isTokenExist(headerCsrf)) {
//            return getCsrfToken(headerCsrf);
//        }
//        return null;
//    }
//
//    private Boolean isTokenExist(String token) {
//        return tokenStore.stream().anyMatch(csrfToken -> csrfToken.getToken().equals(token));
//    }
//
//    private CsrfToken getCsrfToken(String tokenString) {
//        if (tokenString != null) {
//            return tokenStore.stream()
//                    .filter(token -> token.getToken().equals(tokenString))
//                    .findFirst()
//                    .orElse(null);
//        }
//        return null;
//    }
//}
