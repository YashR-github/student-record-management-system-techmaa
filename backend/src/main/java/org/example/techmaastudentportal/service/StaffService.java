package org.example.techmaastudentportal.service;


import jakarta.transaction.Transactional;
import org.example.techmaastudentportal.dto.StaffProfileResponseDTO;
import org.example.techmaastudentportal.dto.StaffSignupReqDTO;
import org.example.techmaastudentportal.dto.StaffSignupResponseDTO;
import org.example.techmaastudentportal.dto.StaffUpdateReqDTO;
import org.example.techmaastudentportal.enums.UserRole;
import org.example.techmaastudentportal.exception.EntityAlreadyExistException;
import org.example.techmaastudentportal.exception.EntityNotFoundException;
import org.example.techmaastudentportal.exception.UnauthorizedAccessException;
import org.example.techmaastudentportal.models.Course;
import org.example.techmaastudentportal.models.Staff;
import org.example.techmaastudentportal.models.User;
import org.example.techmaastudentportal.repository.CourseRepository;
import org.example.techmaastudentportal.repository.StaffRepository;
import org.example.techmaastudentportal.util.AuthenticatedUserUtil;
import org.example.techmaastudentportal.util.ObjectDTOMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StaffService {
    private final PasswordEncoder passwordEncoder;
    private final StaffRepository staffRepository;
    private final AuthenticatedUserUtil authenticatedUserUtil;
    private final CourseRepository courseRepository;

    public StaffService(StaffRepository staffRepository, PasswordEncoder passwordEncoder, AuthenticatedUserUtil authenticatedUserUtil, CourseRepository courseRepository) {
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticatedUserUtil= authenticatedUserUtil;
        this.courseRepository = courseRepository;
    }

    public StaffSignupResponseDTO registerStaff(StaffSignupReqDTO staffDTO){
        if((staffDTO.getEmail()!=null && !staffDTO.getEmail().isBlank() && staffRepository.existsByEmailAndIsDeletedFalse(staffDTO.getEmail()) || (staffDTO.getPhone()!=null && !staffDTO.getPhone().isBlank() && staffRepository.existsByPhoneAndIsDeletedFalse(staffDTO.getPhone())))){
            throw new EntityAlreadyExistException("Staff with given email/phone already exist. Please login instead.");
        }
        Staff staff = new Staff();
        staff.setEmail(staffDTO.getEmail());
        staff.setPhone(staffDTO.getPhone());
        staff.setName(staffDTO.getName());
        staff.setPassword(passwordEncoder.encode(staffDTO.getPassword()));
        staff.setRole(UserRole.STAFF);
        Course course = courseRepository.findByIdAndIsDeletedFalse(staffDTO.getCourseId()).orElseThrow(()-> new EntityNotFoundException("Given course Id does not exist."));
        staff.setCourse(course);
        staff.setGender(staffDTO.getGender());
        staff.setAge(staffDTO.getAge());
        staff.setStaffRole(staffDTO.getStaffRole());
        staff.setAddress(staffDTO.getAddress());
        staff.setDepartment(staffDTO.getDepartment());
        staffRepository.saveAndFlush(staff);
        String staffId= String.format("STAFF%06d", staff.getId());
        staff.setStaffId(staffId);
        staffRepository.save(staff);
        return ObjectDTOMapper.toSignupDto(staff);

    }

    public StaffProfileResponseDTO getProfile(){
        User user = authenticatedUserUtil.getCurrentUser();
        if(user.getRole()!=UserRole.STAFF || user.isDeleted()){
            throw new UnauthorizedAccessException("You are unauthorized to access this page");
        }
        Optional<Staff> optionalStaff = staffRepository.findByIdAndIsDeletedFalse(user.getId());
        if(optionalStaff.isEmpty()) {
            throw new EntityNotFoundException("Staff entity does not exist.");
        }
        return ObjectDTOMapper.toStaffProfileResponseDTO(optionalStaff.get());
    }

    @Transactional
    public StaffProfileResponseDTO updateStaff(StaffUpdateReqDTO staffDTO){
        User user = authenticatedUserUtil.getCurrentUser();
        Optional<Staff> optionalStaff = staffRepository.findByIdAndIsDeletedFalse(user.getId());
        if(optionalStaff.isEmpty()){
            throw new UnauthorizedAccessException("Unauthorized to access.");
        }
        Staff staff = optionalStaff.get();
        if(staffDTO.getGender()!=null){
            staff.setGender(staffDTO.getGender());
        }
        if(staffDTO.getName()!=null && !staffDTO.getName().isBlank()){
            staff.setName(staffDTO.getName());
        }
        if(staffDTO.getAddress()!=null && !staffDTO.getAddress().isBlank()){
            staff.setAddress(staffDTO.getAddress());
        }
        if(staffDTO.getAge()!=null){
            staff.setAge(staffDTO.getAge());
        }
        if(staffDTO.getDepartment()!=null){
            staff.setDepartment(staffDTO.getDepartment());
        }
        if(staffDTO.getPassword()!=null && !staffDTO.getPassword().isBlank()){
            staff.setPassword(passwordEncoder.encode(staffDTO.getPassword()));
        }
        if(staffDTO.getCourseId()!=null){
            Course course = courseRepository.findById(staffDTO.getCourseId()).orElseThrow(()->new EntityNotFoundException("Course Id does not exist."));
            staff.setCourse(course);
        }
        if(staffDTO.getStaffRole()!=null){
            staff.setStaffRole(staffDTO.getStaffRole());
        }

        staffRepository.save(staff);
        return ObjectDTOMapper.toStaffProfileResponseDTO(staff);
    }

    @Transactional
    public void deleteStaff(){
        User user = authenticatedUserUtil.getCurrentUser();
        Optional<Staff> optionalStaff = staffRepository.findByIdAndIsDeletedFalse(user.getId());
        if(optionalStaff.isEmpty()){
            throw new EntityNotFoundException("Entity with given id. does not exist.");
        }
        Staff staff = optionalStaff.get();
        staff.setDeleted(true);
        staffRepository.save(staff);
    }

}
