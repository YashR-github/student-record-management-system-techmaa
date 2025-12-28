package org.example.techmaastudentportal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserEmailOTPLoginReqDTO {

    @NotNull
    @NotBlank
    @Email(message="Invalid email entered.")
    private String email;
}
