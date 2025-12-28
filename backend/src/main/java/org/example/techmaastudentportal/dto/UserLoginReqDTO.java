package org.example.techmaastudentportal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserLoginReqDTO implements UserCredentials{
    @Email(message = "Invalid email format")
    private String email;
    @Pattern(regexp = "^[6-9]\\d{9}$",message="Phone number format provided is incorrect.")
    private String phone;
    @NotNull(message="Password field should not be null")
    private String password;
}
