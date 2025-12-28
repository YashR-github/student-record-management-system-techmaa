package org.example.techmaastudentportal.models;


import jakarta.persistence.*;
import lombok.Data;
import org.example.techmaastudentportal.enums.Department;
import org.example.techmaastudentportal.enums.Gender;

@Entity
@DiscriminatorValue("Student")
@Data
public class Student extends User {
 private String rollNo;
 @ManyToOne
 private Course course;
@Enumerated(EnumType.STRING)
 private Department department;
 private String address;
 private Integer age;
 @Enumerated(EnumType.STRING)
 private Gender gender;
 private Integer academicYear;
 private Integer semester;
 private Double marks=0.0;
}
