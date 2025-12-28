package org.example.techmaastudentportal.service;


import jakarta.transaction.Transactional;
import org.example.techmaastudentportal.dto.StudentProfileResponseDTO;
import org.example.techmaastudentportal.dto.StudentSignupReqDTO;
import org.example.techmaastudentportal.dto.StudentSignupResponseDTO;
import org.example.techmaastudentportal.dto.StudentUpdateReqDTO;
import org.example.techmaastudentportal.enums.UserRole;
import org.example.techmaastudentportal.exception.EntityAlreadyExistException;
import org.example.techmaastudentportal.exception.EntityNotFoundException;
import org.example.techmaastudentportal.exception.UnauthorizedAccessException;
import org.example.techmaastudentportal.models.Course;
import org.example.techmaastudentportal.models.Student;
import org.example.techmaastudentportal.models.User;
import org.example.techmaastudentportal.repository.CourseRepository;
import org.example.techmaastudentportal.repository.StudentRepository;
import org.example.techmaastudentportal.util.AuthenticatedUserUtil;
import org.example.techmaastudentportal.util.ObjectDTOMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
//    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticatedUserUtil authenticatedUserUtil;

    public StudentService(StudentRepository studentRepository, CourseRepository courseRepository, PasswordEncoder passwordEncoder, AuthenticatedUserUtil authenticatedUserUtil) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticatedUserUtil = authenticatedUserUtil;
    }

    @Transactional
    public StudentSignupResponseDTO signUp(StudentSignupReqDTO studentDTO){
        throwEntityAlreadyExistCheck(studentDTO);
        Student student = new Student();
        student.setEmail(studentDTO.getEmail());
        student.setPhone(studentDTO.getPhone());
        student.setName(studentDTO.getName());
        student.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        student.setRole(UserRole.STUDENT);

        if(studentDTO.getCourseId()!=null){
            Course course = courseRepository.findById(studentDTO.getCourseId()).orElseThrow(()-> new EntityNotFoundException("Course with given Id not found"));
            student.setCourse(course);
        }
        student.setDepartment(studentDTO.getDepartment());
        student.setAddress(studentDTO.getAddress());
        student.setAge(studentDTO.getAge());
        student.setGender(studentDTO.getGender());
        student.setAcademicYear(studentDTO.getAcademicYear());
        student.setSemester(studentDTO.getSemester());
        studentRepository.saveAndFlush(student);

        String rollNo = String.format("STU%06d", student.getId());
        student.setRollNo(rollNo);
        studentRepository.save(student);
       return ObjectDTOMapper.toSignupDto(student);
    }

    public StudentProfileResponseDTO getProfile(){
        User user = authenticatedUserUtil.getCurrentUser();
        Optional<Student> optionalStudent = studentRepository.findByIdAndIsDeletedFalse(user.getId());
        if(optionalStudent.isEmpty()){
            throw new EntityNotFoundException("Student not found.");
        }
        Student student = optionalStudent.get();
       return ObjectDTOMapper.toStudentProfileResponseDTO(student);
    }

    @Transactional
    public void deleteStudent(){
        User user = authenticatedUserUtil.getCurrentUser();
        Optional<Student> optionalStudent = studentRepository.findByIdAndIsDeletedFalse(user.getId());
        if(optionalStudent.isEmpty()){
            throw new EntityNotFoundException("Entity with given id. does not exist.");
        }
        Student student = optionalStudent.get();
        student.setDeleted(true);
        studentRepository.save(student);
    }


    @Transactional
    public StudentProfileResponseDTO updateStudent(StudentUpdateReqDTO studentDTO){
        User user = authenticatedUserUtil.getCurrentUser();
        if(!user.getRole().equals(UserRole.STUDENT)) {
            throw new UnauthorizedAccessException("You are unauthorized to access this page");
        }
        if(user.isDeleted()){
            throw new EntityNotFoundException("Student entity does not exist.");
        }
        Student student = studentRepository.findByIdAndIsDeletedFalse(user.getId()).orElseThrow(()-> new EntityNotFoundException("Student entity does not exist."));
        //add updates
        if(studentDTO.getName()!=null && !studentDTO.getName().isBlank()){
            student.setName(studentDTO.getName());
        }
        if(studentDTO.getCourseId()!=null){
            Course course= courseRepository.findById(studentDTO.getCourseId()).orElseThrow(()-> new EntityNotFoundException("No Course found with given Id"));
            student.setCourse(course);
        }
        if(studentDTO.getDepartment()!=null){
            student.setDepartment(studentDTO.getDepartment());
        }
        if(studentDTO.getAddress()!=null && !studentDTO.getAddress().isBlank()){
            student.setAddress(studentDTO.getAddress());
        }
        if(studentDTO.getAge()!=null){
            student.setAge(studentDTO.getAge());
        }
        if(studentDTO.getGender()!=null){
            student.setGender(studentDTO.getGender());
        }
        if(studentDTO.getAcademicYear()!=null){
            student.setAcademicYear(studentDTO.getAcademicYear());
        }
        if(studentDTO.getSemester()!=null){
            student.setSemester(studentDTO.getSemester());
        }
        studentRepository.save(student);
        return ObjectDTOMapper.toStudentProfileResponseDTO(student);
    }


    private void throwEntityAlreadyExistCheck(StudentSignupReqDTO studentDTO){
       if((studentDTO.getEmail()!=null && studentRepository.existsByEmailAndIsDeletedFalse(studentDTO.getEmail())) || (studentDTO.getPhone()!=null && studentRepository.existsByPhoneAndIsDeletedFalse(studentDTO.getPhone()))){
           throw new EntityAlreadyExistException("Student with given email or phone already exists.Please login inistead.");
       }
    }

}






