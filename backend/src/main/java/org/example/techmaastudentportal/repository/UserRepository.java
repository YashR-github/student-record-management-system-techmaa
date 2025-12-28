package org.example.techmaastudentportal.repository;

import org.example.techmaastudentportal.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

//    Optional<User> findByEmail(String email);
//    Optional<User> findByPhone(String phone);
    Boolean existsByEmailAndIsDeletedFalse(String email);
    Boolean existsByPhoneAndIsDeletedFalse(String phone);
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    Optional<User> findByPhoneAndIsDeletedFalse(String phone);
    Optional<User> findByIdAndIsDeletedFalse(Long userId);

}
