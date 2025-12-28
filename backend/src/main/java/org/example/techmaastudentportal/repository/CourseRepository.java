package org.example.techmaastudentportal.repository;

import org.example.techmaastudentportal.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course,Long> {

    Optional<Course> findByIdAndIsDeletedFalse(Long courseId);

}
