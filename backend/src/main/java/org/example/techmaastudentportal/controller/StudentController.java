package org.example.techmaastudentportal.controller;


import jakarta.validation.Valid;
import org.example.techmaastudentportal.dto.StudentProfileResponseDTO;
import org.example.techmaastudentportal.dto.StudentSignupReqDTO;
import org.example.techmaastudentportal.dto.StudentSignupResponseDTO;
import org.example.techmaastudentportal.dto.StudentUpdateReqDTO;
import org.example.techmaastudentportal.service.StudentService;
import org.example.techmaastudentportal.util.ValidationUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class StudentController {
    private StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/auth/register-student")
    public ResponseEntity<StudentSignupResponseDTO> signUp(@Valid @RequestBody StudentSignupReqDTO signupStudent){
        ValidationUtil.checkContactCredential(signupStudent);
        StudentSignupResponseDTO responseDTO= studentService.signUp(signupStudent);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    //get student profile data
    @GetMapping("/student/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponseDTO> getStudentProfile(){
        StudentProfileResponseDTO responseDTO = studentService.getProfile();
        return ResponseEntity.ok(responseDTO);
    }

    @PatchMapping("/student/profile/update")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponseDTO> updateStudentProfile(@RequestBody StudentUpdateReqDTO studentDTO){
        StudentProfileResponseDTO responseDTO = studentService.updateStudent(studentDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/student/delete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> deleteProfile(){
        studentService.deleteStudent();
        return new ResponseEntity<>(HttpStatus.OK);
    }

}


