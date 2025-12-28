package org.example.techmaastudentportal.dto;


import lombok.Data;
import org.example.techmaastudentportal.enums.Gender;

@Data
public class AdminProfileResponseDTO {
    private String email;
    private String adminId;
    private String name;
    private String phone;
    private Gender gender;
    private String password;
}
