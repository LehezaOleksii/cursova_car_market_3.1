package com.oleksii.leheza.projects.carmarket.exceptions;

import java.util.Arrays;

public class SecurityException extends RuntimeException {
    public SecurityException(String message) {
        super(message);
    }

    public SecurityException(String... message) {
        super(Arrays.toString(message));
    }
}
