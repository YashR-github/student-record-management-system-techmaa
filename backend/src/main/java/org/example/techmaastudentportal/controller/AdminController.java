package org.example.techmaastudentportal.controller;


import jakarta.validation.Valid;
import org.example.techmaastudentportal.dto.*;
import org.example.techmaastudentportal.service.AdminService;
import org.example.techmaastudentportal.service.StaffService;
import org.example.techmaastudentportal.service.StudentService;
import org.example.techmaastudentportal.util.FormatUtil;
import org.example.techmaastudentportal.util.ValidationUtil;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class AdminController {
    private final StudentService studentService;
    private final StaffService staffService;
    private final AdminService adminService;

    public AdminController(StudentService studentService, StaffService staffService, AdminService adminService) {
        this.studentService = studentService;
        this.staffService = staffService;
        this.adminService = adminService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/register-student")
    public ResponseEntity<StudentSignupResponseDTO> registerStudent(@Valid @RequestBody StudentSignupReqDTO signupStudent){
        ValidationUtil.checkContactCredential(signupStudent);
        StudentSignupResponseDTO responseDTO= studentService.signUp(signupStudent);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    @PostMapping("/auth/register-admin")
    public ResponseEntity<AdminSignupResponseDTO> registerAdmin(@Valid @RequestBody AdminSignupReqDTO signupAdmin){
        ValidationUtil.checkContactCredential(signupAdmin);
        AdminSignupResponseDTO responseDTO= adminService.registerAdmin(signupAdmin);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/register-staff")
    public ResponseEntity<StaffSignupResponseDTO> registerStaff(@Valid @RequestBody StaffSignupReqDTO signupStaff){
        ValidationUtil.checkContactCredential(signupStaff);
        StaffSignupResponseDTO responseDTO= staffService.registerStaff(signupStaff);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/profile")
    public ResponseEntity<AdminProfileResponseDTO> getAdminProfile(){
        AdminProfileResponseDTO responseDTO = adminService.getProfile();
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }


    @PatchMapping("/admin/profile/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProfileResponseDTO> updateAdminProfile(@RequestBody AdminUpdateReqDTO adminDTO){
        AdminProfileResponseDTO responseDTO = adminService.updateAdmin(adminDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/admin/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProfile(){
        adminService.deleteAdmin();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //search by varied attributes keyword, name, course, mobile, etc
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(value="/admin/students/filter")
    public ResponseEntity<List<StudentResponseDTO>> getFilteredStudents(@ParameterObject StudentFilterReqDTO studentFilterDTO){
        List<StudentResponseDTO> studentDTO = adminService.getStudents(studentFilterDTO);
        return ResponseEntity.ok(studentDTO);
    }

    //view student by ID/phone
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/student/{rollNo}")
    ResponseEntity<StudentResponseDTO> getStudentByRollNo(@PathVariable ("rollNo") String rollNo){
        StudentResponseDTO studentDTO = adminService.getStudentByRollNo(rollNo);
        return new ResponseEntity<>(studentDTO,HttpStatus.OK);
    }

    // export student data to excel
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/students/filter/export/excel")
    public ResponseEntity<byte[]> exportStudentData(@ParameterObject StudentFilterReqDTO studentFilterDTO){
        List<StudentResponseDTO> studentDTO = adminService.getStudents(studentFilterDTO);
        byte[] excelData = adminService.exportStudentsToExcel(studentDTO);

        String filename= "Students_"+ FormatUtil.formatDateTime() + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelData);
    }
}
