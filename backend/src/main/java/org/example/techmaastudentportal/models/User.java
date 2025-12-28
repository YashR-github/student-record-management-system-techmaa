package org.example.techmaastudentportal.models;

import jakarta.persistence.*;
import lombok.Data;
import org.example.techmaastudentportal.enums.UserRole;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type")
@Data
public class User extends BaseModel {
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    private String phone;
    private String name;
    private String password;
    @Enumerated(EnumType.STRING)
    private UserRole role;
}
