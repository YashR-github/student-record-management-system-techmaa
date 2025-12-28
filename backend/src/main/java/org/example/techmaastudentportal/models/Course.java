package org.example.techmaastudentportal.models;


import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Course extends BaseModel{
    private String title;
    private String description;
    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    private List<Staff> staffMembers;
    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    private List<Student> students;
}
