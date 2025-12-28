package org.example.techmaastudentportal.repository;

import org.example.techmaastudentportal.models.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff,Long> {

    Boolean existsByEmailAndIsDeletedFalse(String email);
    Boolean existsByPhoneAndIsDeletedFalse(String phone);
    Optional<Staff> findByIdAndIsDeletedFalse(Long userId);
}
