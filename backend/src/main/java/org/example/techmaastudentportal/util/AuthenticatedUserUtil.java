package org.example.techmaastudentportal.util;


import org.example.techmaastudentportal.exception.EntityNotFoundException;
import org.example.techmaastudentportal.exception.UnauthorizedAccessException;
import org.example.techmaastudentportal.models.User;
import org.example.techmaastudentportal.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUserUtil { //extracts user from the security context

    private final UserRepository userRepository;

    public AuthenticatedUserUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser(){
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();

        if(auth==null || !auth.isAuthenticated() || auth.getName()==null) {
            throw new EntityNotFoundException("Authentication failed or token expired. Please login again.");
        }
        Long userId;
        try{
            userId= Long.valueOf(auth.getName());
        }
        catch(NumberFormatException e){
            throw new UnauthorizedAccessException("Invalid authentication token.");
        }
        return userRepository.findByIdAndIsDeletedFalse(userId).orElseThrow(()-> new EntityNotFoundException("User account no longer exist."));
        }
    }

