package org.example.techmaastudentportal.dto;

import lombok.Data;
import org.example.techmaastudentportal.enums.UserRole;

@Data
public class UserLoginResponseDTO {
    private String email;
    private String phone;
    private String name;
    private UserRole role;
}
