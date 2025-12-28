package org.example.techmaastudentportal.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.techmaastudentportal.models.User;


@Data
@AllArgsConstructor
public class LoginResult {
    private User user;
    private String token;
}
