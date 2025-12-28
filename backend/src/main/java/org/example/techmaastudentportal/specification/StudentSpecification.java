package org.example.techmaastudentportal.specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.example.techmaastudentportal.dto.StudentFilterReqDTO;
import org.example.techmaastudentportal.enums.Department;
import org.example.techmaastudentportal.enums.Gender;
import org.example.techmaastudentportal.exception.BadRequestException;
import org.example.techmaastudentportal.models.Student;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class StudentSpecification implements Specification<Student> {

    private final StudentFilterReqDTO filterDTO;

    public StudentSpecification(StudentFilterReqDTO filterDTO){
        this.filterDTO= filterDTO;
    }


public Predicate toPredicate(Root<Student> root, CriteriaQuery<?> query, CriteriaBuilder cb){
   List<Predicate> predicates = new ArrayList<>();
        if(filterDTO.getKeyword()!=null && !filterDTO.getKeyword().isBlank()) {
            String pattern = "%" + filterDTO.getKeyword().toLowerCase() + "%";
            predicates.add(
                    cb.or(
                            cb.like(cb.lower(root.get("name")),pattern),
                            cb.like(cb.lower(root.get("address")), pattern)
                    )
            );
        }

        if(filterDTO.getEmail()!=null && !filterDTO.getEmail().isBlank()) {
            String toSearch= filterDTO.getEmail().toLowerCase();
          predicates.add(cb.equal(cb.lower(root.get("email")),toSearch));
        }
        if(filterDTO.getPhone()!=null && !filterDTO.getPhone().isBlank()){
            predicates.add(cb.equal(root.get("phone"),filterDTO.getPhone()));
        }
        if(filterDTO.getName()!=null && !filterDTO.getName().isBlank()) {
            String toSearch= filterDTO.getName().toLowerCase();
            predicates.add(cb.equal(cb.lower(root.get("name")),toSearch));
        }
        if(filterDTO.getCourseName()!=null && !filterDTO.getCourseName().isBlank()) {
            String toSearch= filterDTO.getCourseName().toLowerCase();
            predicates.add(cb.equal(cb.lower(root.get("course").get("title")),toSearch));
        }
        if(filterDTO.getDepartment()!=null && !filterDTO.getDepartment().isBlank()) {
            try{
            Department toSearch= Department.valueOf(filterDTO.getDepartment().toUpperCase());
            predicates.add(cb.equal(root.get("department"),toSearch));
            }
        catch(IllegalArgumentException e){
                throw new BadRequestException("Invalid department value");
        }
        }
        if(filterDTO.getGender()!=null && !filterDTO.getGender().isBlank()){
            try{
                Gender toSearch = Gender.valueOf(filterDTO.getGender().toUpperCase());
                predicates.add(cb.equal(root.get("gender"),toSearch));
            }
            catch(BadRequestException e){
                throw new BadRequestException("Invalid gender value");
            }
        }
        if(filterDTO.getRollNo()!=null && !filterDTO.getRollNo().isBlank()){
            String toSearch= filterDTO.getRollNo();
            predicates.add(cb.equal(root.get("rollNo"),toSearch));
        }
        if(filterDTO.getMarks()!=null){
            Double toSearch= filterDTO.getMarks();
            predicates.add(cb.greaterThanOrEqualTo(root.get("marks"),toSearch));
        }
        predicates.add(cb.equal(root.get("isDeleted"),false)); // default to return active users only

    return cb.and(predicates.toArray(new Predicate[0]));
}

}
