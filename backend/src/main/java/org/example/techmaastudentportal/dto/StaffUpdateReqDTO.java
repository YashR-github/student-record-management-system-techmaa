package org.example.techmaastudentportal.dto;


import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import org.example.techmaastudentportal.enums.Department;
import org.example.techmaastudentportal.enums.Gender;
import org.example.techmaastudentportal.enums.StaffRole;

@Data
public class StaffUpdateReqDTO {
    private String name;
    private String password;
    private Department department;
    private StaffRole staffRole;
    @PositiveOrZero
    private Long courseId;
    private String address;
    private Gender gender;
    @Positive
    private Integer age;
}
