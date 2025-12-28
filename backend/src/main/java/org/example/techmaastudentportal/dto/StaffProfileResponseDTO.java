package org.example.techmaastudentportal.dto;


import lombok.Data;
import org.example.techmaastudentportal.enums.Department;
import org.example.techmaastudentportal.enums.Gender;
import org.example.techmaastudentportal.enums.StaffRole;

@Data
public class StaffProfileResponseDTO {
    private String email;
    private String staffId;
    private String name;
    private String phone;
    private String address;
    private Gender gender;
    private Integer age;
    private String courseTitle;
    private Department department;
    private StaffRole staffRole;
    private String password;
}

