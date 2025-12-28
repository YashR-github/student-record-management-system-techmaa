package org.example.techmaastudentportal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class StudentFilterReqDTO {
    @Email(message = "Invalid email format")
    private String email;
    @Pattern(regexp = "^[6-9]\\d{9}$")
    private String phone;
    private String name;
    private String rollNo;
    private String courseName;
    private String department;
    private String keyword;
    private String Gender;
    private Integer academicYear;
    private Integer semester;
    @PositiveOrZero
    private Double marks;
    private String sortBy= "createdAt";
    private String sortDir= "asc";

}
