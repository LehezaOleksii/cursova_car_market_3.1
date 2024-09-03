package com.oleksii.leheza.projects.carmarket.exceptions;

import java.util.Arrays;

public class SmtpException extends RuntimeException {
    public SmtpException(String message) {
        super(message);
    }

    public SmtpException(String... message) {
        super(Arrays.toString(message));
    }
}
