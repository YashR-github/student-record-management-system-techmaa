package org.example.techmaastudentportal.repository;

import org.example.techmaastudentportal.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course,Long> {

}
