package org.example.techmaastudentportal.controller;


import jakarta.validation.Valid;
import org.example.techmaastudentportal.dto.*;
import org.example.techmaastudentportal.security.JwtUtil;
import org.example.techmaastudentportal.service.AuthService;
import org.example.techmaastudentportal.service.LoginResult;
import org.example.techmaastudentportal.util.ObjectDTOMapper;
import org.example.techmaastudentportal.util.ValidationUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    public AuthController(AuthService authService,JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil= jwtUtil;
    }


    @PostMapping("/login/password")
    public ResponseEntity<UserLoginResponseDTO> loginUser(@Valid @RequestBody UserLoginReqDTO loginUser){
        ValidationUtil.checkContactCredential(loginUser);
        LoginResult result = authService.login(loginUser);
        ResponseCookie cookie= jwtUtil.generateTokenCookie(result.getToken());
        UserLoginResponseDTO responseDTO= ObjectDTOMapper.toUserLoginResponseDTO(result.getUser());

      return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(responseDTO);
    }


    @PostMapping("/login/generate-otp")
    public ResponseEntity<Void> generateLoginEmailOTP(@Valid @RequestBody UserEmailOTPLoginReqDTO reqDTO){
        authService.generateEmailOTP(reqDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/login/verify-otp")
    public ResponseEntity<UserLoginResponseDTO> validateLoginEmailOTP(@Valid @RequestBody UserEmailOTPLoginValidationDTO reqDTO){
        LoginResult result= authService.validateLoginOtp(reqDTO);
        ResponseCookie cookie = jwtUtil.generateTokenCookie(result.getToken());
        UserLoginResponseDTO responseDTO = ObjectDTOMapper.toUserLoginResponseDTO(result.getUser());
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE,cookie.toString())
        .body(responseDTO);
    }


    @PostMapping("/logout-user")
    public ResponseEntity<Void> logoutUser() {

        ResponseCookie expiredCookie = authService.logout();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expiredCookie.toString())
                .build();
    }

}
