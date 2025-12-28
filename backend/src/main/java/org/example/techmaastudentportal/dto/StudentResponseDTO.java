package org.example.techmaastudentportal.dto;

import lombok.Data;
import org.example.techmaastudentportal.enums.Department;
import org.example.techmaastudentportal.enums.Gender;
import org.example.techmaastudentportal.enums.UserRole;

@Data
public class StudentResponseDTO {

    private String email;
    private String phone;
    private String name;
    private UserRole role;
    private String rollNo;
    private String courseTitle;
    private Department department;
    private String address;
    private Integer age;
    private Gender gender;
    private Integer academicYear;
    private Integer semester;
    private Double marks;
}
