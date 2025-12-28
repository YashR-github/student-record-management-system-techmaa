package org.example.techmaastudentportal.dto;

import lombok.Data;
import org.example.techmaastudentportal.enums.Gender;
import org.example.techmaastudentportal.enums.UserRole;


@Data
public class AdminSignupResponseDTO {
    private String email;
    private String phone;
    private String name;
    private UserRole role;
    private String adminId;
    private Gender gender;
}
