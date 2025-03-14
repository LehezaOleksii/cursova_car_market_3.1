package com.oleksii.leheza.projects.carmarket.enums;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@Getter
public enum UserRole implements GrantedAuthority {

    ROLE_MANAGER(1),
    ROLE_CLIENT(2);

    private final int order;

    UserRole(int order) {
        this.order = order;
    }

    @Override
    public String getAuthority() {
        return this.name();
    }
}
