package org.example.techmaastudentportal.util;


import org.example.techmaastudentportal.dto.*;
import org.example.techmaastudentportal.models.Admin;
import org.example.techmaastudentportal.models.Staff;
import org.example.techmaastudentportal.models.Student;
import org.example.techmaastudentportal.models.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ObjectDTOMapper {

    public static StudentSignupResponseDTO toSignupDto(Student student){
        StudentSignupResponseDTO  responseDTO= new  StudentSignupResponseDTO();
        responseDTO.setEmail(student.getEmail());
        responseDTO.setPhone(student.getPhone());
        responseDTO.setName(student.getName());
        responseDTO.setRole(student.getRole());
        responseDTO.setRollNo(student.getRollNo());
        if(student.getCourse()!=null)
        {responseDTO.setCourseTitle(student.getCourse().getTitle());}
        responseDTO.setDepartment(student.getDepartment());
        responseDTO.setAddress(student.getAddress());
        responseDTO.setAge(student.getAge());
        responseDTO.setGender(student.getGender());
        responseDTO.setAcademicYear(student.getAcademicYear());
        responseDTO.setSemester(student.getSemester());
        responseDTO.setMarks(student.getMarks());
        return responseDTO;
    }

    public static StaffSignupResponseDTO toSignupDto(Staff staff){
        StaffSignupResponseDTO  responseDTO= new  StaffSignupResponseDTO();
        responseDTO.setEmail(staff.getEmail());
        responseDTO.setPhone(staff.getPhone());
        responseDTO.setName(staff.getName());
        responseDTO.setRole(staff.getRole());
        responseDTO.setStaffId(staff.getStaffId());
        return responseDTO;
    }

    public static AdminSignupResponseDTO toSignupDto(Admin admin){
        AdminSignupResponseDTO  responseDTO= new  AdminSignupResponseDTO();
        responseDTO.setEmail(admin.getEmail());
        responseDTO.setPhone(admin.getPhone());
        responseDTO.setName(admin.getName());
        responseDTO.setRole(admin.getRole());
        responseDTO.setAdminId(admin.getAdminId());
        responseDTO.setGender(admin.getGender());
        return responseDTO;
    }


    public static StudentResponseDTO toStudentResponseDTO(Student student){

        StudentResponseDTO responseDTO= new StudentResponseDTO();
        responseDTO.setEmail(student.getEmail());
        responseDTO.setPhone(student.getPhone());
        responseDTO.setName(student.getName());
        responseDTO.setRole(student.getRole());
        responseDTO.setRollNo(student.getRollNo());
        responseDTO.setCourseTitle(student.getCourse()!=null ? student.getCourse().getTitle() : "");
        responseDTO.setDepartment(student.getDepartment());
        responseDTO.setAddress(student.getAddress());
        responseDTO.setAge(student.getAge());
        responseDTO.setGender(student.getGender());
        responseDTO.setAcademicYear(student.getAcademicYear());
        responseDTO.setSemester(student.getSemester());

        return responseDTO;

    }

    public static List<StudentResponseDTO> toStudentResponseDtoList(List<Student> students){
        List<StudentResponseDTO> responseDTOList = new ArrayList<>();
    for(Student s: students){
        responseDTOList.add(toStudentResponseDTO(s));
    }
    return responseDTOList;
    }

    public static UserLoginResponseDTO toUserLoginResponseDTO(User user){
        UserLoginResponseDTO responseDTO = new UserLoginResponseDTO();
        responseDTO.setEmail(user.getEmail());
        responseDTO.setPhone(user.getPhone());
        responseDTO.setName(user.getName());
        responseDTO.setRole(user.getRole());
        return responseDTO;
    }
    public static AdminProfileResponseDTO toAdminProfileResponseDTO(Admin admin){
        AdminProfileResponseDTO responseDTO = new AdminProfileResponseDTO();
        responseDTO.setEmail(admin.getEmail());
        responseDTO.setPhone(admin.getPhone());
        responseDTO.setName(admin.getName());
        responseDTO.setAdminId(admin.getAdminId());
        responseDTO.setGender(admin.getGender());
        responseDTO.setPassword(admin.getPassword());
        return responseDTO;
    }

    public static StudentProfileResponseDTO toStudentProfileResponseDTO(Student student){
        StudentProfileResponseDTO responseDTO = new StudentProfileResponseDTO();
        responseDTO.setEmail(student.getEmail());
        responseDTO.setPhone(student.getPhone());
        responseDTO.setRollNo(student.getRollNo());
        responseDTO.setRole(student.getRole());
        responseDTO.setName(student.getName());
        responseDTO.setCourseId(student.getCourse().getId());
        responseDTO.setDepartment(student.getDepartment());
        responseDTO.setAddress(student.getAddress());
        responseDTO.setAge(student.getAge());
        responseDTO.setGender(student.getGender());
        responseDTO.setAcademicYear(student.getAcademicYear());
        responseDTO.setSemester(student.getSemester());
        responseDTO.setPassword(student.getPassword());
        responseDTO.setMarks(student.getMarks());
        return responseDTO;
    }

    public static StaffProfileResponseDTO toStaffProfileResponseDTO(Staff staff){
        StaffProfileResponseDTO responseDTO = new StaffProfileResponseDTO();
        responseDTO.setEmail(staff.getEmail());
        responseDTO.setPhone(staff.getPhone());
        responseDTO.setStaffId(staff.getStaffId());
        responseDTO.setStaffRole(staff.getStaffRole());
        responseDTO.setName(staff.getName());
        responseDTO.setAddress(staff.getAddress());
        responseDTO.setAge(staff.getAge());
        responseDTO.setDepartment(staff.getDepartment());
        responseDTO.setGender(staff.getGender());
        responseDTO.setPassword(staff.getPassword());
        responseDTO.setCourseTitle(staff.getCourse().getTitle());
        return responseDTO;
    }

}
