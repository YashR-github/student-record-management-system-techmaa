package org.example.techmaastudentportal.models;


import jakarta.persistence.*;
import lombok.Data;
import org.example.techmaastudentportal.enums.Gender;

@Entity
@DiscriminatorValue("Admin")
@Data
public class Admin extends User{
    private String adminId;
    @Enumerated(EnumType.STRING)
    private Gender gender;

}
