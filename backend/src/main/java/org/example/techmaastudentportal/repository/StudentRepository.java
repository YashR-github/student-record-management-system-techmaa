package org.example.techmaastudentportal.repository;

import org.example.techmaastudentportal.models.Student;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student,Long>, JpaSpecificationExecutor<Student> {

    List<Student> findAll(Specification s, Sort sort);

    Boolean existsByEmailAndIsDeletedFalse(String email);
    Boolean existsByPhoneAndIsDeletedFalse(String phone);

    Optional<Student> findByRollNoAndIsDeletedFalse(String rollNo);

    Optional<Student> findByIdAndIsDeletedFalse(Long userId);

}
