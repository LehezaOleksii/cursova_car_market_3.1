package com.oleksii.leheza.projects.carmarket.exceptions;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalResourceExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleException(AuthenticationException ex, HttpServletRequest request) {
        log.error("handle error AuthenticationException; message:{} , cause: {}", ex.getMessage(), ex.getCause().getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Authentication Not Found")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(ChatException.class)
    public ResponseEntity<ErrorResponse> handleException(ChatException ex, HttpServletRequest request) {
        log.error("handle error ChatException; message:{} , cause: {}", ex.getMessage(), ex.getCause().getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(HttpStatus.METHOD_NOT_ALLOWED.value())
                .error("Chat error")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(errorResponse);
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleException(ResourceAlreadyExistsException ex, HttpServletRequest request) {
        log.error("handle error ResourceAlreadyExistException; message:{} , cause: {}", ex.getMessage(), ex.getCause().getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(HttpStatus.CONFLICT.value())
                .error("Resource Already Exists ")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleException(ResourceNotFoundException ex, HttpServletRequest request) {
        log.error("handle error ResourceNotFoundException; message:{} , cause: {}", ex.getMessage(), ex.getCause().getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(HttpStatus.NOT_FOUND.value())
                .error("Resource Not Found")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(java.lang.SecurityException.class)
    public ResponseEntity<ErrorResponse> handleException(java.lang.SecurityException ex, HttpServletRequest request) {
        log.error("handle error SecurityException; message:{} , cause: {}", ex.getMessage(), ex.getCause().getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(HttpStatus.UNAUTHORIZED.value())
                .error("Security exception")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(SmtpException.class)
    public ResponseEntity<ErrorResponse> handleException(SmtpException ex, HttpServletRequest request) {
        log.error("handle error SmtpException; message:{} , cause: {}", ex.getMessage(), ex.getCause().getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(HttpStatus.METHOD_NOT_ALLOWED.value())
                .error("SMTP system exception")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(errorResponse);
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ErrorResponse> handleException(SecurityException ex, HttpServletRequest request) {
        log.error("handle error UserPlanException; message:{} , cause: {}", ex.getMessage(), ex.getCause().getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(HttpStatus.METHOD_NOT_ALLOWED.value())
                .error("Security Exception")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(errorResponse);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleException(ValidationException ex, HttpServletRequest request) {
        log.error("handle error ValidationException; message:{} , cause: {}", ex.getMessage(), ex.getCause().getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .error("Validation Exception")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex, HttpServletRequest request) {
        log.error("handle error Exception; message:{} , cause: {}", ex.getMessage(), ex.getCause().getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Exception")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
