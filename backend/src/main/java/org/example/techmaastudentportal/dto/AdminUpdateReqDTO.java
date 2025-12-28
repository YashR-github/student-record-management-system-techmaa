package org.example.techmaastudentportal.dto;


import lombok.Data;
import org.example.techmaastudentportal.enums.Gender;

@Data
public class AdminUpdateReqDTO {
    private String name;
    private Gender gender;
    private String password;
}
