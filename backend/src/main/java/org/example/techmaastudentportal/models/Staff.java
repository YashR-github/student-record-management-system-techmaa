package org.example.techmaastudentportal.models;

import jakarta.persistence.*;
import lombok.Data;
import org.example.techmaastudentportal.enums.Department;
import org.example.techmaastudentportal.enums.Gender;
import org.example.techmaastudentportal.enums.StaffRole;

@Entity
@DiscriminatorValue("Staff")
@Data
public class Staff extends User{
    private String staffId;
    @Enumerated(EnumType.STRING)
    private Department department;
    @Enumerated(EnumType.STRING)
    private StaffRole staffRole;
    @ManyToOne
    private Course course;
    private String address;
    private Gender gender;
    private Integer age;
}
