package org.example.techmaastudentportal.service;

import jakarta.transaction.Transactional;
import org.example.techmaastudentportal.dto.*;
import org.example.techmaastudentportal.exception.EntityNotFoundException;
import org.example.techmaastudentportal.exception.InvalidCredentialsException;
import org.example.techmaastudentportal.models.User;
import org.example.techmaastudentportal.repository.UserRepository;
import org.example.techmaastudentportal.security.JwtUtil;
import org.example.techmaastudentportal.util.OtpUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String,String> redisTemplate;
    @Qualifier("emailNotification")
    private final Notification notification;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,JwtUtil jwtUtil,RedisTemplate redisTemplate,Notification notification) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
        this.notification = notification;
    }

    @Transactional
    public LoginResult login(UserLoginReqDTO userDTO){
        if((userDTO.getEmail()!=null && !userDTO.getEmail().isBlank() && !userRepository.existsByEmailAndIsDeletedFalse(userDTO.getEmail())) ||(userDTO.getPhone()!=null && !userDTO.getPhone().isBlank() && !userRepository.existsByPhoneAndIsDeletedFalse(userDTO.getPhone()))){
            throw new EntityNotFoundException("User with given Credentials not found.Please Signup.");
        }
        User user= new User();
        if(userDTO.getEmail()!=null && !userDTO.getEmail().isBlank()){
            user= userRepository.findByEmailAndIsDeletedFalse(userDTO.getEmail()).get();
        }
        else if(userDTO.getPhone()!=null && !userDTO.getPhone().isBlank()){
            user= userRepository.findByPhoneAndIsDeletedFalse(userDTO.getPhone()).get();
        }
        if(!passwordEncoder.matches(userDTO.getPassword(),user.getPassword())){
            throw new InvalidCredentialsException("Provided credentials does not match a valid account.");
        }

        String token= jwtUtil.generateToken(user.getId(), user.getRole().toString());
        return new LoginResult(user,token);
    }

    @Transactional
    public void generateEmailOTP(UserEmailOTPLoginReqDTO reqDTO){
        if((reqDTO.getEmail()!=null && !reqDTO.getEmail().isBlank() && !userRepository.existsByEmailAndIsDeletedFalse(reqDTO.getEmail()))){
            throw new EntityNotFoundException("User with given Email not found.Please Register first.");
        }
        String otp = OtpUtil.generateRandomOTP();
        NotificationReqDTO emailDTO = new NotificationReqDTO();
        emailDTO.setTo(reqDTO.getEmail());
        emailDTO.setSubject("Your Techmaa Portal Login OTP");
        StringBuilder builder= new StringBuilder();
        builder.append("Welcome to Techmaa Portal!\n\n");
        builder.append("Your One-Time-Password (OTP) for login is:\n\n");
        builder.append("This OTP is valid for 5 minutes. Please do not share this OTP with anyone.\n");
        builder.append(otp);
        emailDTO.setBody(builder.toString());
        redisTemplate.opsForValue().set(reqDTO.getEmail(),otp,5, TimeUnit.MINUTES);
        notification.sendNotification(emailDTO);
    }

    @Transactional
    public LoginResult validateLoginOtp(UserEmailOTPLoginValidationDTO reqDTO){
        if((reqDTO.getEmail()!=null && !reqDTO.getEmail().isBlank() && !userRepository.existsByEmailAndIsDeletedFalse(reqDTO.getEmail()))){
            throw new EntityNotFoundException("User with given Email not found. Please Register first.");
        }
        if(!reqDTO.getOtp().equals(redisTemplate.opsForValue().get(reqDTO.getEmail()))){
            throw new InvalidCredentialsException("Provided OTP is incorrect.");
        }
        User user= userRepository.findByEmailAndIsDeletedFalse(reqDTO.getEmail()).get();
        String token= jwtUtil.generateToken(user.getId(), user.getRole().toString());
        return new LoginResult(user,token);
    }

    @Transactional
    public ResponseCookie logout() {
        return ResponseCookie.from("ACCESS_TOKEN", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
    }


}
