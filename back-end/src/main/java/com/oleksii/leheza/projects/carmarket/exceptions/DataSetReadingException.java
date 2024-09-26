package com.oleksii.leheza.projects.carmarket.exceptions;

public class DataSetReadingException extends RuntimeException {

    public DataSetReadingException(String message) {
        super(message);
    }

    public DataSetReadingException(Throwable cause) {
        super(cause);
    }
}
