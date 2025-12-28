package org.example.techmaastudentportal.dto;


import lombok.Data;

@Data
public class UserEmailOTPLoginValidationDTO {
    private String email;
    private String otp;
}
