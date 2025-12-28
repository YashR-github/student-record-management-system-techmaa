package org.example.techmaastudentportal.dto;

import lombok.Data;
import org.example.techmaastudentportal.enums.Department;
import org.example.techmaastudentportal.enums.StaffRole;
import org.example.techmaastudentportal.enums.UserRole;

@Data
public class StaffSignupResponseDTO {
    private String email;
    private String phone;
    private String name;
    private String staffId;
    private UserRole role;
    private Department department;
    private StaffRole staffRole;
}
