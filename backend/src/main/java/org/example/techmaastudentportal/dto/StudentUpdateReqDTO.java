package org.example.techmaastudentportal.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import org.example.techmaastudentportal.enums.Department;
import org.example.techmaastudentportal.enums.Gender;

@Data
public class StudentUpdateReqDTO {
    private String name;
    @PositiveOrZero
    private Long courseId;
    private Department department;
    private String address;
    @PositiveOrZero
    private Integer age;
    private Gender gender;
    @PositiveOrZero
    private Integer academicYear;
    @PositiveOrZero
    private Integer semester;
    private String password;
}
