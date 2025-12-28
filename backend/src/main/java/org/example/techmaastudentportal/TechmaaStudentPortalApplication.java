package org.example.techmaastudentportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TechmaaStudentPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechmaaStudentPortalApplication.class, args);
	}

}
