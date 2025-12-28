package org.example.techmaastudentportal.controlleradvice;


import org.example.techmaastudentportal.dto.ResponseDTO;
import org.example.techmaastudentportal.exception.EntityAlreadyExistException;
import org.example.techmaastudentportal.exception.EntityNotFoundException;
import org.example.techmaastudentportal.exception.InvalidCredentialsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;


@RestControllerAdvice
public class ControllerAdvice {


    @ExceptionHandler(MethodArgumentNotValidException.class) // exception handler for controller @Valid check
    public ResponseEntity<ResponseDTO<Map<String,String>>> handleControllerValidation(MethodArgumentNotValidException ex){
        Map<String,String> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .collect(Collectors.toMap(FieldError::getField,
                        FieldError::getDefaultMessage,
                        (a,b) -> a // in case of duplicate field errors
                ));
        return ResponseEntity.badRequest().body(new ResponseDTO<>("Validation failure", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDTO<Map<String, Object>>> handleGenericException(Exception ex, WebRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("error", "Internal Server Error");
        errorDetails.put("details", ex.getMessage());
        errorDetails.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorDetails.put("path", ((ServletWebRequest) request).getRequest().getRequestURI());

        ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>("An unexpected error occurred.", errorDetails);
        return new ResponseEntity<>(responseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ResponseDTO<Map<String, Object>>> handleEntityNotFoundException(EntityNotFoundException ex, WebRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("error", "NOT FOUND.");
        errorDetails.put("details", ex.getMessage());
        errorDetails.put("status", HttpStatus.NOT_FOUND.value());
        errorDetails.put("path", ((ServletWebRequest) request).getRequest().getRequestURI());

        ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>("Request Failed", errorDetails);
        return new ResponseEntity<>(responseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ResponseDTO<Map<String, Object>>> handleInvalidCredentialsException(InvalidCredentialsException ex, WebRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("error", "Invalid Credentials.");
        errorDetails.put("details", ex.getMessage());
        errorDetails.put("status", HttpStatus.UNAUTHORIZED.value());
        errorDetails.put("path", ((ServletWebRequest) request).getRequest().getRequestURI());

        ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>("Login Failed", errorDetails);
        return new ResponseEntity<>(responseDTO, HttpStatus.UNAUTHORIZED);
    }


    @ExceptionHandler(EntityAlreadyExistException.class)
    public ResponseEntity<ResponseDTO<Map<String, Object>>> handleUserAlreadyExistException(EntityAlreadyExistException ex, WebRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("error", "ALREADY EXISTS");
        errorDetails.put("details", ex.getMessage());
        errorDetails.put("status", HttpStatus.CONFLICT.value());
        errorDetails.put("path", ((ServletWebRequest) request).getRequest().getRequestURI());

        ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>("Request Failed", errorDetails);
        return new ResponseEntity<>(responseDTO, HttpStatus.CONFLICT);
    }



}
