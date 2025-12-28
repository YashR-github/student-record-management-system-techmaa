package org.example.techmaastudentportal.service;


import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.techmaastudentportal.dto.*;
import org.example.techmaastudentportal.enums.UserRole;
import org.example.techmaastudentportal.exception.EntityAlreadyExistException;
import org.example.techmaastudentportal.exception.EntityNotFoundException;
import org.example.techmaastudentportal.exception.UnauthorizedAccessException;
import org.example.techmaastudentportal.models.Admin;
import org.example.techmaastudentportal.models.Student;
import org.example.techmaastudentportal.models.User;
import org.example.techmaastudentportal.repository.AdminRepository;
import org.example.techmaastudentportal.repository.StudentRepository;
import org.example.techmaastudentportal.specification.StudentSpecification;
import org.example.techmaastudentportal.util.AuthenticatedUserUtil;
import org.example.techmaastudentportal.util.ObjectDTOMapper;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticatedUserUtil authenticatedUserUtil;

    public AdminService(AdminRepository adminRepository, StudentRepository studentRepository, PasswordEncoder passwordEncoder, AuthenticatedUserUtil authenticatedUserUtil) {
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticatedUserUtil = authenticatedUserUtil;
    }

    @Transactional
    public AdminSignupResponseDTO registerAdmin(AdminSignupReqDTO adminDTO){
        Admin admin = new Admin();
        if((adminDTO.getEmail()!=null && !adminDTO.getEmail().isBlank() && adminRepository.existsByEmailAndIsDeletedFalse(adminDTO.getEmail()) || (adminDTO.getPhone()!=null && !adminDTO.getPhone().isBlank() && adminRepository.existsByPhoneAndIsDeletedFalse(adminDTO.getPhone())))){
            throw new EntityAlreadyExistException("Admin with given email/phone already exist.Please login instead.");
        }
        admin.setEmail(adminDTO.getEmail());
        admin.setPhone(adminDTO.getPhone());
        admin.setName(adminDTO.getName());
        admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        admin.setRole(UserRole.ADMIN);
        admin.setGender(adminDTO.getGender());

        adminRepository.saveAndFlush(admin);
        String adminId= String.format("AD%06d", admin.getId());
        admin.setAdminId(adminId);
        adminRepository.save(admin);
        return ObjectDTOMapper.toSignupDto(admin);
    }

    public AdminProfileResponseDTO getProfile(){
        User user = authenticatedUserUtil.getCurrentUser();
        if(user.getRole()!=UserRole.ADMIN || user.isDeleted()){
            throw new UnauthorizedAccessException("You are unauthorized to access this page");
        }
        Optional<Admin> optionalAdmin = adminRepository.findByIdAndIsDeletedFalse(user.getId());
        if(optionalAdmin.isEmpty()) {
            throw new EntityNotFoundException("Admin entity does not exist.");
        }
        return ObjectDTOMapper.toAdminProfileResponseDTO(optionalAdmin.get());
    }

    public List<StudentResponseDTO> getStudents(StudentFilterReqDTO studentFilterDTO){
    
        Specification<Student> specification = new StudentSpecification(studentFilterDTO);
        Sort sort= "desc".equalsIgnoreCase(studentFilterDTO.getSortDir())
                ? Sort.by(studentFilterDTO.getSortBy()).descending()
                : Sort.by(studentFilterDTO.getSortBy()).ascending();
        List<Student> students = studentRepository.findAll(specification,sort);
        return ObjectDTOMapper.toStudentResponseDtoList(students);
    }

    public StudentResponseDTO getStudentByRollNo(String rollNo){
       Optional<Student> optionalStudent = studentRepository.findByRollNoAndIsDeletedFalse(rollNo);
       if(optionalStudent.isEmpty() || optionalStudent.get().isDeleted()) {
           throw new EntityNotFoundException("Student with given roll no. not found.");
       }
       Student student = optionalStudent.get();
        return ObjectDTOMapper.toStudentResponseDTO(student);

    }

    @Transactional
    public AdminProfileResponseDTO updateAdmin(AdminUpdateReqDTO adminDTO){
        User user = authenticatedUserUtil.getCurrentUser();
        Optional<Admin> optionalAdmin = adminRepository.findByIdAndIsDeletedFalse(user.getId());
        if(optionalAdmin.isEmpty()){
            throw new UnauthorizedAccessException("Unauthorized to access.");
        }
        Admin admin = optionalAdmin.get();
        if(adminDTO.getGender()!=null){
            admin.setGender(adminDTO.getGender());
        }
        if(adminDTO.getName()!=null && !adminDTO.getName().isBlank()){
            admin.setName(adminDTO.getName());
        }
        if(adminDTO.getPassword()!=null && !adminDTO.getPassword().isBlank()){
            admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        }
        adminRepository.save(admin);
        return ObjectDTOMapper.toAdminProfileResponseDTO(admin);
    }

    @Transactional
    public void deleteAdmin(){
        User user = authenticatedUserUtil.getCurrentUser();
        Optional<Admin> optionalAdmin = adminRepository.findByIdAndIsDeletedFalse(user.getId());
        if(optionalAdmin.isEmpty()){
            throw new EntityNotFoundException("Entity with given id. does not exist.");
        }
        Admin admin = optionalAdmin.get();
        admin.setDeleted(true);
        adminRepository.save(admin);
    }

    //export to excel
    public byte[] exportStudentsToExcel(List<StudentResponseDTO> studentDTOList){
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Students");
            //Create Bold header Style
            CellStyle headerStyle =workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            String[] headers = {
                    "Roll No", "Name", "Email", "Phone", "Role",
                    "Course", "Department", "Address", "Age",
                    "Gender", "Year", "Semester", "Marks"
            };

            // Create Header Row
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Populate Data Rows
            int rowIdx = 1;
            for (StudentResponseDTO student : studentDTOList) {
                Row row = sheet.createRow(rowIdx++);

                // Assuming StudentResponseDTO has these fields
                 row.createCell(0).setCellValue(student.getRollNo());
                 row.createCell(1).setCellValue(student.getName());
                 row.createCell(2).setCellValue(student.getEmail()!=null ? student.getEmail() : "");
                row.createCell(3).setCellValue(student.getPhone()!=null ? student.getPhone(): "");
                row.createCell(4).setCellValue(student.getRole()!=null ? student.getRole().toString():"");
                row.createCell(5).setCellValue(student.getCourseTitle()!=null ? student.getCourseTitle():"N/A");
                row.createCell(6).setCellValue(student.getDepartment()!=null ? student.getDepartment().toString(): "");
                row.createCell(7).setCellValue(student.getAddress());
                row.createCell(8).setCellValue(student.getAge()!=null ? student.getAge(): 0);
                row.createCell(9).setCellValue(student.getGender()!=null ? student.getGender().toString(): "");
                row.createCell(10).setCellValue(student.getAcademicYear() !=null ? student.getAcademicYear():0);
                row.createCell(11).setCellValue(student.getSemester()!=null ? student.getSemester():0);
                row.createCell(12).setCellValue(student.getMarks()!= null ? student.getMarks():0.0);

            }
            //Auto-size columns
            for(int i=0;i<headers.length;i++){
                sheet.autoSizeColumn(i);
            }
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Excel Generation Error: "+ e.getMessage());
        }
    }

}
