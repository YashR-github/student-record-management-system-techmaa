package org.example.techmaastudentportal.repository;

import org.example.techmaastudentportal.models.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository  extends JpaRepository<Admin,Long> {

    Boolean existsByEmailAndIsDeletedFalse(String email);
    Boolean existsByPhoneAndIsDeletedFalse(String phone);
    Optional<Admin> findByIdAndIsDeletedFalse(Long id);
}
