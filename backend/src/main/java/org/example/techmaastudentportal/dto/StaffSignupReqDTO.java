package org.example.techmaastudentportal.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.example.techmaastudentportal.enums.Department;
import org.example.techmaastudentportal.enums.Gender;
import org.example.techmaastudentportal.enums.StaffRole;

@Data
public class StaffSignupReqDTO implements UserCredentials{
    @Email(message = "Invalid email format")
    private String email;
    @Pattern(regexp = "^[6-9]\\d{9}$")
    private String phone;
    @NotBlank(message="Name field should not be blank.")
    private String name;
    @NotNull(message="Password field should not be null.")
    private String password;

    private Department department;
    private Long courseId;
    private String address;
    private Integer age;
    private Gender gender;
    private StaffRole staffRole;
}
