package org.example.techmaastudentportal.util;


import org.example.techmaastudentportal.dto.UserCredentials;
import org.example.techmaastudentportal.exception.InvalidCredentialsException;

public class ValidationUtil {

    public static void checkContactCredential(UserCredentials credential){
        boolean isEmailInvalid= credential.getEmail()==null || credential.getEmail().isBlank() ;
        boolean isPhoneInvalid= credential.getPhone()==null || credential.getPhone().isBlank();
        if(isEmailInvalid && isPhoneInvalid) {
            throw new InvalidCredentialsException("Email and Phone fields both cannot be blank");
        }
    }
}
