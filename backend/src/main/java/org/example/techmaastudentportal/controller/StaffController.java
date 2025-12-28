package org.example.techmaastudentportal.controller;

import org.example.techmaastudentportal.dto.StaffProfileResponseDTO;
import org.example.techmaastudentportal.dto.StaffSignupReqDTO;
import org.example.techmaastudentportal.dto.StaffSignupResponseDTO;
import org.example.techmaastudentportal.security.JwtUtil;
import org.example.techmaastudentportal.service.StaffService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class StaffController {
    private final StaffService staffService;
    private final JwtUtil jwtUtil;

    public StaffController(StaffService staffService, JwtUtil jwtUtil) {
        this.staffService = staffService;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/auth/register-staff")
    public ResponseEntity<StaffSignupResponseDTO> registerStaff(@RequestBody StaffSignupReqDTO requestDTO){
        StaffSignupResponseDTO responseDTO= staffService.registerStaff(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('STAFF')")
    @GetMapping("/staff/profile")
    public ResponseEntity<StaffProfileResponseDTO> getStaffProfile(){
        StaffProfileResponseDTO responseDTO = staffService.getProfile();
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/staff/delete")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> deleteProfile(){
        staffService.deleteStaff();
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
